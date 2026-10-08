const { ac, rs } = require('../constants');
const { authModal } = require('../modals');
const RequestUtil = require('../utils/request.util');
const { generateToken, getLoggedInUser } = require('../utils/jwt');
const { cookieConfig } = require('../configs/cookie.config');

exports.getLoggedInUser = async (req, res) => {
    try {
        const loggedInUser = getLoggedInUser(req);
        loggedInUser.menus = await authModal.getNavigations(loggedInUser);

        return res.status(ac.status.success).send(rs.getSuccessResponse(loggedInUser));
    } catch (err) {
        return res.status(ac.status.success).send(rs.getServerErrorResponse(err));
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const loggedInUser = getLoggedInUser(req);
        const user = await authModal.getUserProfile(loggedInUser);
        return res.status(ac.status.success).send(rs.getSuccessResponse(user));
    } catch (err) {
        return res.status(ac.status.success).send(rs.getServerErrorResponse(err));
    }
};

exports.userEmailLogin = async (req, res) => {
    try {
        const jsonData = req.body;
        const missingParams = RequestUtil.isAllParametersPresent([jsonData, 'email', 'password', 'deviceId']);
        if (missingParams.length > 0) {
            return res.status(ac.status.success).send(rs.getParameterMissingResponse(missingParams));
        }

        const login = await authModal.userEmailLogin(jsonData);
        if (!login || login.return_value !== 1) {
            return res.status(ac.status.success).send(rs.getSuccessResponse(login));
        }

        const profile = await authModal.getUsersByEmail(jsonData);
        const token = generateToken(profile);

        if (token) {
            const tokenValidUpto = new Date(Date.now() + cookieConfig.maxAge);
            await authModal.setUserToken({
                userId: profile.user_id,
                activeToken: token,
                tokenValidUpto,
                deviceId: jsonData.deviceId
            });
            res.cookie('token', token, cookieConfig);
        }

        profile.menus = await authModal.getNavigations(profile);
        return res.status(ac.status.success).send(rs.getSuccessResponse({
            return_value: login.return_value,
            message: login.message,
            user : profile
        }));
    } catch (err) {
        return res.status(ac.status.success).send(rs.getServerErrorResponse(err));
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const user = getLoggedInUser(req);
        const response = await authModal.updateUserLogout({ email: user.email });
        if (response.return_value === 1) {
            res.clearCookie('token');
        }

        return res.status(ac.status.success).send(rs.getSuccessResponse(response));
    } catch (err) {
        return res.status(ac.status.success).send(rs.getServerErrorResponse(err));
    }
};

exports.validateEmailLLogin = async (req, res) => {
    try {

        const jsonData = req.body;
        const missingParams = RequestUtil.isAllParametersPresent([jsonData, 'email', 'password', 'deviceId']);
        if (missingParams.length > 0) {
            return res.status(ac.status.success).send(rs.getParameterMissingResponse(missingParams));
        }

        const response = await authModal.validateEmailLLogin(jsonData);
        return res.status(ac.status.success).send(rs.getSuccessResponse(response));

    } catch (err) {
        return res.status(ac.status.success).send(rs.getServerErrorResponse(err));
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = getLoggedInUser(req);
        const jsonData = req.body || {};
        const missing = RequestUtil.isAllParametersPresent([jsonData, 'userName']);
        if (missing.length) return res.status(ac.status.success).send(rs.getParameterMissingResponse(missing));
        if (jsonData.profilePhoto) {
            if (jsonData.profilePhoto.startsWith('data:') && !/^data:image\/(png|jpeg|webp);base64,/i.test(jsonData.profilePhoto)) {
                return res.status(ac.status.success).send(rs.getResponseStructure(ac.status.badRequest, 'Profile image must be PNG, JPEG or WebP.'));
            }
            const payload = jsonData.profilePhoto.replace(/^data:image\/(png|jpeg|webp);base64,/i, '').replace(/\s/g, '');
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(payload) || payload.length % 4 !== 0) {
                return res.status(ac.status.success).send(rs.getResponseStructure(ac.status.badRequest, 'Profile image must be valid Base64.'));
            }
            if (Buffer.from(payload, 'base64').length > 524288) {
                return res.status(ac.status.success).send(rs.getResponseStructure(ac.status.badRequest, 'Profile image must not exceed 512 KB.'));
            }
        }
        const response = await authModal.updateUserProfile({ userId: user.user_id, ...jsonData });
        return res.status(ac.status.success).send(rs.getSuccessResponse(response));
    } catch (error) {
        return res.status(ac.status.success).send(rs.getServerErrorResponse(error));
    }
};

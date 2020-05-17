const DEV = {
    IMG_ROOT: 'avorion-econ/images/'
};

const PROD = {
    IMG_ROOT: '/avorion-econ/static/images/'
};

export const ENV = process.env.NODE_ENV === 'production' ? PROD : DEV;

const DEV = {
    IMG_ROOT: 'avorion-econ/images/'
};

const PROD = {
    IMG_ROOT: '/avorion-econ/images/'
};

export const ENV = process.env.NODE_ENV === 'production' ? PROD : DEV;

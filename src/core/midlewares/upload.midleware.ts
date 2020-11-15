import * as util from 'util';
import multer from 'multer';
import { checkfileType } from '../helpers/check-file-type';
import { Environment } from '../environment';
import * as path from 'path';

//Multer - Set storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/avatars')
    },
    filename: function (req, file, callback) {
        callback(null, 'avatar-' + Date.now() + path.extname(file.originalname))
    }
});

//Init Upload 
export  const upload = multer({
    storage: storage,
    limits: { fileSize: Environment.avatarImageZise },
    fileFilter: function (req, file, callback) {
        checkfileType(file, callback);
    }
}).single('avatar');

export const uploadFileMiddleware = util.promisify(upload);
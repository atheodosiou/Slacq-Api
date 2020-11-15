import * as path from 'path';

export function checkfileType(file: any, cb: Function) {
    //allowed ext
    const fileTypes = /jpeg|jpg|png|gif/;
    //Check the ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //Check the mime
    const mimetype = fileTypes.test(file.mimetype)
    console.log('extname:', extname, 'mimetype:', mimetype);
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        return cb('Error: Images Only!');
    }
}
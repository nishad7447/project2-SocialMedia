import express from 'express';
import multer from 'multer';
import path from 'path';


// Multer Config
const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".mp4" ) {
            const error = new multer.MulterError('File type is not supported');
            new Error("File type is not supported");
            error.http_codem = 401;
            cb(error, false);
            return;
        }
        cb(null,true);
    }  
});

export default upload;
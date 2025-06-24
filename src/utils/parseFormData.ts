import multer from 'multer';

export const parseFormData = multer().none(); // Parses only text fields, not files

# S3 → GridFS Migration

PDFs are now stored in MongoDB using GridFS instead of AWS S3.

## What changed

- **Resume model**: `pdfUrl` and `s3Key` removed; **`fileId`** (ObjectId) references the file in GridFS bucket `resumes`.
- **Storage**: Files are in MongoDB collections `resumes.files` and `resumes.chunks`.
- **Serving**: `GET /api/resumes/:id/file` streams the PDF (replaces signed S3 URLs).
- **Backend**: `backend/src/utils/s3.js` removed; **`backend/src/utils/gridfs.js`** added for upload/delete/stream.

## Frontend

No changes required. The API still returns **`pdfUrl`** and **`signedPdfUrl`** as the URL to the new file endpoint (e.g. `http://localhost:5000/api/resumes/<id>/file`). `ResumeCard` and `PdfViewer` keep using `signedPdfUrl` as before.

## Backend env

You can remove these from `backend/.env`:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET` / `AWS_BUCKET_NAME`

## Uninstall AWS packages

From the **backend** directory:

```bash
cd backend
npm uninstall @aws-sdk/client-s3 @aws-sdk/s3-request-presigner aws-sdk
```

Then run `npm install` if needed.

## Multer

`backend/src/middleware/upload.js` still uses **memory storage** (no change). The uploaded buffer is sent to GridFS in the controller. The only update was a safe default for `fileSize` when `UPLOAD_LIMIT` is missing: `(parseInt(process.env.UPLOAD_LIMIT, 10) || 10) * 1024 * 1024` (10MB default).

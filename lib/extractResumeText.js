import fs from "fs";
import path from "path";
import { extractText } from "unpdf";

export async function extractResumeText(resumePath) {
  const filePath = path.join(process.cwd(), "public", resumePath);

  const pdfBuffer = await fs.promises.readFile(filePath);

  const pdfData = new Uint8Array(pdfBuffer);

  const { text } = await extractText(pdfData, {
    mergePages: true,
  });

  return text;
}
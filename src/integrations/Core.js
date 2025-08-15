export async function UploadFile(file) {
  // Placeholder: simulate file upload
  return Promise.resolve({ url: URL.createObjectURL(file) });
}

export async function InvokeLLM(payload) {
  // Placeholder: simulate model invocation
  return Promise.resolve({ data: payload });
}

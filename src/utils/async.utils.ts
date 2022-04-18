export async function wait(timeout: number): Promise<void> {
  return await new Promise(resolve => setTimeout(resolve, timeout));
}

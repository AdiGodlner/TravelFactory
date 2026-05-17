export function getErrorMessage(err: any, msg: string) {
	return err?.response?.data?.message || err?.message || msg;
}

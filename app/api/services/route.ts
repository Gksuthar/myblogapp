import { GET as SERVICE_GET, POST as SERVICE_POST, PUT as SERVICE_PUT, PATCH as SERVICE_PATCH, DELETE as SERVICE_DELETE } from "../service/route";

// Explicit wrappers to ensure Next picks up handlers on this route
export async function GET(req: Request) {
	return SERVICE_GET(req);
}

export async function POST(req: Request) {
	return SERVICE_POST(req);
}

export async function PUT(req: Request) {
	return SERVICE_PUT(req);
}

export async function PATCH(req: Request) {
	return SERVICE_PATCH(req);
}

export async function DELETE(req: Request) {
	return SERVICE_DELETE(req);
}

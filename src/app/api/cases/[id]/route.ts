import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectMongo } from "@/lib/mongodb";
import { CaseModel } from "@/models/Case";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function PATCH(_request: Request, { params }: Props) {
  const { id } = await params;

  await connectMongo();
  const updatedCase = await CaseModel.findByIdAndUpdate(
    id,
    { $set: { status: "completed" } },
    { new: true, runValidators: true },
  );

  if (!updatedCase) {
    return NextResponse.json({ ok: false, message: "Case not found." }, { status: 404 });
  }

  revalidatePath("/all-cases");
  revalidatePath("/overview");
  revalidatePath("/queries");
  revalidatePath(`/cases/${updatedCase.registrationNumber}`);

  return NextResponse.json({ ok: true, status: updatedCase.status });
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;

  await connectMongo();
  const deletedCase = await CaseModel.findByIdAndDelete(id);

  if (!deletedCase) {
    return NextResponse.json({ ok: false, message: "Case not found." }, { status: 404 });
  }

  revalidatePath("/all-cases");
  revalidatePath("/overview");
  revalidatePath("/queries");
  revalidatePath(`/cases/${deletedCase.registrationNumber}`);

  return NextResponse.json({ ok: true });
}

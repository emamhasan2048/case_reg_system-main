import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectMongo } from "@/lib/mongodb";
import { CaseModel, type CaseStatus, type ViolationCode } from "@/models/Case";

export type CaseView = {
  id: string;
  driverName: string;
  licenseNumber: string;
  address: string;
  registrationNumber: string;
  vehicleModel: string;
  color: string;
  manufactureYear: number;
  violationCode: ViolationCode;
  violationDate: string;
  status: CaseStatus;
};

type CaseDocumentView = Omit<CaseView, "id" | "violationDate"> & {
  _id: { toString: () => string };
  violationDate: Date;
};

function serializeCase(doc: CaseDocumentView): CaseView {
  return {
    id: doc._id.toString(),
    driverName: doc.driverName,
    licenseNumber: doc.licenseNumber,
    address: doc.address,
    registrationNumber: doc.registrationNumber,
    vehicleModel: doc.vehicleModel,
    color: doc.color,
    manufactureYear: doc.manufactureYear,
    violationCode: doc.violationCode,
    violationDate: doc.violationDate.toISOString().slice(0, 10),
    status: doc.status ?? "pending",
  };
}

export async function getCases() {
  await connectMongo();
  const docs = await CaseModel.find().sort({ violationDate: -1, createdAt: -1 }).lean();
  return docs.map(serializeCase);
}

export async function getCasesForPage() {
  try {
    return { cases: await getCases(), databaseError: false };
  } catch (error) {
    console.error("Failed to load cases:", error);
    return { cases: [] as CaseView[], databaseError: true };
  }
}

export async function getCasesByRegistration(registration: string) {
  await connectMongo();
  const docs = await CaseModel.find({ registrationNumber: registration.toUpperCase() })
    .sort({ violationDate: -1, createdAt: -1 })
    .lean();
  return docs.map(serializeCase);
}

export async function getCaseGroups() {
  const cases = await getCases();
  return Array.from(new Map(cases.map((item) => [item.registrationNumber, item])).values());
}

export async function createCase(formData: FormData) {
  "use server";

  const registrationNumber = String(formData.get("registrationNumber") || "").toUpperCase().trim();

  try {
    await connectMongo();
    await CaseModel.create({
      driverName: String(formData.get("driverName") || "").trim(),
      licenseNumber: String(formData.get("licenseNumber") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      registrationNumber,
      vehicleModel: String(formData.get("vehicleModel") || "").trim(),
      color: String(formData.get("color") || "").trim(),
      manufactureYear: Number(formData.get("manufactureYear")),
      violationCode: String(formData.get("violationCode") || "SP-01"),
      violationDate: new Date(String(formData.get("violationDate") || new Date().toISOString())),
      status: "pending",
    });
  } catch (error) {
    console.error("Failed to create case:", error);
    redirect("/?error=database");
  }

  revalidatePath("/");
  revalidatePath("/all-cases");
  revalidatePath("/overview");
  revalidatePath("/queries");
  revalidatePath(`/cases/${registrationNumber}`);
  redirect("/?success=1");
}

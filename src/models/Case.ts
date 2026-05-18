import mongoose, { Schema, model, models } from "mongoose";

export type ViolationCode = "SP-01" | "RL-02" | "PK-03" | "NB-04" | "DU-05" | "PH-06" | "OT-99";
export type CaseStatus = "pending" | "completed";

export type TrafficCase = {
  _id: string;
  driverName: string;
  licenseNumber: string;
  address: string;
  registrationNumber: string;
  vehicleModel: string;
  color: string;
  manufactureYear: number;
  violationCode: ViolationCode;
  violationDate: Date;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
};

const caseSchema = new Schema<TrafficCase>(
  {
    driverName: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true, uppercase: true },
    vehicleModel: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    manufactureYear: { type: Number, required: true },
    violationCode: {
      type: String,
      enum: ["SP-01", "RL-02", "PK-03", "NB-04", "DU-05", "PH-06", "OT-99"],
      required: true,
    },
    violationDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending", required: true },
  },
  { timestamps: true },
);

caseSchema.index({ registrationNumber: 1, violationDate: -1 });
caseSchema.index({ driverName: 1 });

if (models.Case && !models.Case.schema.path("status")) {
  mongoose.deleteModel("Case");
}

export const CaseModel = models.Case || model<TrafficCase>("Case", caseSchema);

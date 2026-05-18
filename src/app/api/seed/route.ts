import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { CaseModel } from "@/models/Case";

const sampleCases = [
  {
    driverName: "Ingrida Šimkutė",
    licenseNumber: "LT-00562",
    address: "Šiauliai, Tilžės 9",
    registrationNumber: "LTU-2204",
    vehicleModel: "Renault Clio",
    color: "Red",
    manufactureYear: 2020,
    violationCode: "SP-01",
    violationDate: new Date("2025-11-03"),
    status: "pending",
  },
  {
    driverName: "Aleksas Jonaitis",
    licenseNumber: "LT-00241",
    address: "Vilnius, Gedimino 5",
    registrationNumber: "LTU-4821",
    vehicleModel: "VW Golf",
    color: "Gray",
    manufactureYear: 2019,
    violationCode: "PK-03",
    violationDate: new Date("2026-01-10"),
    status: "pending",
  },
  {
    driverName: "Tomas Grigas",
    licenseNumber: "LT-00883",
    address: "Kaunas, Laisvės 12",
    registrationNumber: "LTU-8832",
    vehicleModel: "Toyota Corolla",
    color: "White",
    manufactureYear: 2021,
    violationCode: "SP-01",
    violationDate: new Date("2026-04-22"),
    status: "pending",
  },
  {
    driverName: "Ingrida Šimkutė",
    licenseNumber: "LT-00562",
    address: "Šiauliai, Tilžės 9",
    registrationNumber: "LTU-2204",
    vehicleModel: "Renault Clio",
    color: "Red",
    manufactureYear: 2020,
    violationCode: "DU-05",
    violationDate: new Date("2026-04-25"),
    status: "completed",
  },
  {
    driverName: "Mindaugas Petrauskas",
    licenseNumber: "LT-00774",
    address: "Klaipėda, Taikos 18",
    registrationNumber: "LTU-7741",
    vehicleModel: "Audi A4",
    color: "Black",
    manufactureYear: 2018,
    violationCode: "RL-02",
    violationDate: new Date("2026-04-27"),
    status: "pending",
  },
  {
    driverName: "Rūta Kazlauskienė",
    licenseNumber: "LT-00339",
    address: "Panevėžys, Respublikos 3",
    registrationNumber: "LTU-3390",
    vehicleModel: "Ford Focus",
    color: "Blue",
    manufactureYear: 2017,
    violationCode: "PK-03",
    violationDate: new Date("2026-04-28"),
    status: "pending",
  },
  {
    driverName: "Aleksas Jonaitis",
    licenseNumber: "LT-00241",
    address: "Vilnius, Gedimino 5",
    registrationNumber: "LTU-4821",
    vehicleModel: "VW Golf",
    color: "Gray",
    manufactureYear: 2019,
    violationCode: "SP-01",
    violationDate: new Date("2026-04-30"),
    status: "pending",
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  await connectMongo();
  await CaseModel.deleteMany({});
  await CaseModel.insertMany(sampleCases);

  return NextResponse.json({
    ok: true,
    inserted: sampleCases.length,
    message: "Seeded traffic cases.",
  });
}

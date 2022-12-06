import "reflect-metadata";
import { CompanyInteface } from "./interface";
import { container } from "./inversify.config";
import { COMPANY } from "./types";

const company = container.get<CompanyInteface>(COMPANY)

console.log(company.getEmployee())
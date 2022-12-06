import { Container } from "inversify";
import { Company, Employee } from "./company";
import { COMPANY, USER } from "./types";

const container = new Container();
container.bind(USER).to(Employee);
container.bind(COMPANY).to(Company);

export { container }
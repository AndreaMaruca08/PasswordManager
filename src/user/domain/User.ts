import {validateString} from "../../shared/Validators";
import {generateMasterKey} from "./CodeGenerator";

export class User {
    private readonly id : number;
    private readonly name : string;
    private readonly masterkey : string;
    private password : string;

    public constructor(id : number, name: string, password: string, masterkey?: string) {
        validateString(name, "Il nome deve essere valido");
        validateString(password, "La password deve essere valida")
        this.id = id;
        this.name = name;
        this.password = password;
        this.masterkey = !masterkey ? generateMasterKey() : masterkey;
    }

    get Id(): number {
        return this.id;
    }
    get Name(): string {
        return this.name;
    }
    get Password(): string {
        return this.password;
    }
    get MasterKey(): string {
        return this.masterkey;
    }

    set Password(value: string) {
        validateString(value, "La password deve essere valida");
        this.password = value;
    }
}
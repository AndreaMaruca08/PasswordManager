import {validateString} from "../../shared/Validators";

export class Password {
    private readonly id:bigint;
    private readonly title:string;
    private readonly website:string;
    private readonly encryptedPassword:string;
    private readonly createdAt:Date;
    private readonly userId:number;

    constructor(id:bigint | undefined, title:string, website:string, encryptedPassword:string, userId:number, createdAt:Date){
        validateString(title, "Il titolo deve essere valido");
        validateString(website, "Il sito web deve essere valido");
        validateString(encryptedPassword, "La password deve essere valida");
        validateString(userId.toString(), "L'id utente deve essere valido");
        this.title = title;
        this.website = website;
        this.encryptedPassword = encryptedPassword;
        this.userId = userId;
        this.createdAt = createdAt;
        this.id = id ?? BigInt(0);
    }

    get Id (){
        return this.id;
    }
    get Title (){
        return this.title;
    }
    get Website (){
        return this.website;
    }
    get EncryptedPassword (){
        return this.encryptedPassword;
    }
    get UserId (){
        return this.userId;
    }
    get CreatedAt (){
        return this.createdAt;
    }
}
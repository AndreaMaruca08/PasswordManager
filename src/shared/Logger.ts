import chalk from "chalk";
import expressPkg from "express/package.json";
import prismaPkg from "@prisma/client/package.json";

export class Logger {
    static port: number;

    private static message = `
    ██████╗  █████╗ ███████╗███████╗██╗    ██╗ ██████╗ ██████╗ ██████╗ 
    ██╔══██╗██╔══██╗██╔════╝██╔════╝██║    ██║██╔═══██╗██╔══██╗██╔══██╗
    ██████╔╝███████║███████╗███████╗██║ █╗ ██║██║   ██║██████╔╝██████╔╝
    ██╔═══╝ ██╔══██║╚════██║╚════██║██║███╗██║██║   ██║██╔══██╗██╔══██╗
    ██║     ██║  ██║███████║███████║╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝
    ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ 
                                                                        
    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗       
    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗      
    ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝      
    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗      
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║      
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝  
    
    RUNTIME
      Node.js: ${process.version}
    FRAMEWORKS
      Express.js: v${expressPkg.version}
      Prisma: v${prismaPkg.version}
    DATABASE
      PostgreSQL
      
     Author: Andrea Maruca
    `;

    static start(port: number): void {
        this.port = port;
        console.log(chalk.greenBright.bold(this.message));
        console.log(chalk.greenBright.bold(
            "==============================================="));
        Logger.info("Server started");
    }


    static info(message: unknown): void {
        this.base(chalk.green("INFO: ") + message);
    }

    static warn(message: unknown): void {
        this.base(chalk.yellow("WARN: ") + message);
    }

    static err(message: unknown): void {
        this.base(chalk.red("ERR: ") + message);
    }

    static base(message: unknown): void {
        console.log("| " +Logger.getTempoFormattato() + " | port:" + this.port + " | " + message);
    }

    private static getTempoFormattato(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
}
import express from 'express';
export abstract class CommonRoutes {
    name: string;
    path: string;

    protected constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
    }

    getName() {
        return this.name;
    }

    getPath(){
        return this.path;
    }

    abstract configureRoutes(): express.Router;
}

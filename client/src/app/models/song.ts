export class User{
    //public _id: string;
    constructor(
        public number: number,
        public name: string,
        public duration: string,
        public file:string,
        public album:string,
    ){
        //this._id = _id; Comeantado por que lo hacemos de la forma que esta hecho. Minimalista. De la forma que etsa funcionando no es necesario setters ni getters.
    }
}
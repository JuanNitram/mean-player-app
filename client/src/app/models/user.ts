export class User{
    //public _id: string;
    constructor(
        public _id:string,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
        public role: string,
        public image:string,
    ){
        //this._id = _id; Comeantado por que lo hacemos de la forma que esta hecho. Minimalista. De la forma que etsa funcionando no es necesario setters ni getters.
    }
}
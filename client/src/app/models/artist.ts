export class Artist{
    //public _id: string;
    constructor(
        public name: string,
        public description: string,
        public image:string,
    ){
        //this._id = _id; Comeantado por que lo hacemos de la forma que esta hecho. Minimalista. De la forma que etsa funcionando no es necesario setters ni getters.
    }
}
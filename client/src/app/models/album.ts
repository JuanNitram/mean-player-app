export class Album{
    //public _id: string;
    constructor(
        public title: string,
        public description: string,
        public year: number,
        public image:string,
        public artist: string,
    ){
        //this._id = _id; Comeantado por que lo hacemos de la forma que esta hecho. Minimalista. De la forma que etsa funcionando no es necesario setters ni getters.
    }
}
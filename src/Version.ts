

const { assign } = Object;


export default class Version {


    static from ( version : string ){

        const bits = version
            .split('.')
            .map((bit) => parseInt(bit));

        return new Version(bits);
    }


    private bits : number [];


    constructor ( bits : number [] = [] ){

        console.log(bits)

        const { length } = bits;

        if(bits.length > 3)
            throw `Malformed Version String\nHas ${ length } bits instead of at most 3.`

        this.bits = assign([ 0 , 0 , 0 ],bits);
    }


    isUpdate ( version : Version ){

        const { bits } = this;

        for ( let i = 0 ; i < 3 ; i++ )
            if(version.bits[i] > bits[i])
                return true

        return false
    }

    isBugFix ( version : Version ){

        if( version.major !== this.major )
            return false

        if( version.build !== this.build )
            return false

        return version.fix > this.fix
    }


    get major (){
        return this.bits[0]
    }

    get build (){
        return this.bits[1]
    }

    get fix (){
        return this.bits[2]
    }


    get string (){
        return this.bits
            .join('.')
    }

    get data (){
        return this.bits
    }
}

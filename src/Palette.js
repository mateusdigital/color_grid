class Palette
{

    constructor()
    {
        this.colors = [];
        for(let i = 0; i < 10; ++i) {
            let c = chroma.hsl(360 / 10 * i, 1, 0.5);
            this.colors.push(c);
        }
    }

    getColor(i)
    {
        return this.colors[i];
    }


}; // class Palette

export class Helper {
    public static dynamicColors(n): string[] {
        let colors: string[] = new Array();
        for (let i = 0; i < n; i++) {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            colors.push("rgba(" + r + "," + g + "," + b + ",0.5)");
        }
        return colors;
    }
}
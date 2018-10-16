/**
* makecode I2C LCM1602-14(Tiny) package for microbit.
* From ling.
* http://www.lingsky.net
*/

/**
 * Tiny I2C LCM1602-14 液晶软件包
 */
//% weight=100 color=#55F343 icon=""
namespace I2C_LCD1602_14 {
    let i2cAddr = 0x3E;
    //let BK: number      // backlight control Not Use

    /**
     * 初始化 LCD, 设置 I2C 地址。根据芯片不同地址有两种，LCM1602-14 是62(0x3E)。
     * @param address is i2c address for LCD, eg: 62 (0x3E)
     */
    //% blockId="I2C_LCD1602_Init" block="初始化液晶"
    //% weight=100 blockGap=8
    export function LcdInit() {
        basic.pause(50)
        cmd(0x28)       // set 4bit mode
        basic.pause(5)
        cmd(0x28)       // set 4bit mode
        basic.pause(1)
        cmd(0x0C)
        cmd(0x06)
        cmd(0x01)       // clear wait more then 2ms
        basic.pause(5)
    }

    /**
     * 在液晶的指定位置显示数字
     * @param n is number will be show, eg: 10, 100, 200
     * @param x is LCD column position, eg: 0
     * @param y is LCD row position, eg: 0
     */
    //% blockId="I2C_LCD1602_SHOW_NUMBER" block="显示 数字 %n|位置 x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        ShowString(s, x, y)
    }

    /**
     * 在液晶的指定位置显示字符串
     * @param s is string will be show, eg: "Hello micro:bit!"
     * @param x is LCD column position, [0 - 15], eg: 0
     * @param y is LCD row position, [0 - 1], eg: 0
     */
    //% blockId="I2C_LCD1602_SHOW_STRING" block="显示 字符串 %s|位置 x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowString(s: string, x: number, y: number): void {
        setCursor(x, y);

        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i))
        }
    }

    /**
     * 清除液晶上显示的内容
     */
    //% blockId="I2C_LCD1602_CLEAR" block="清除液晶显示内容"
    //% weight=75 blockGap=8
    export function clear(): void {
        cmd(0x01)
        basic.pause(5)
    }

    /**
     * 造字 1602一共可以造8个5*8的自定义字符
     * @param code is font code, eg: 0
     * @param fontList is 8 byte list
     */
    //% blockId="I2C_LCD1602_Create_CustomChar" block="自定义字符 %code |编码 %fontList=CustomCharConv"
    //% code.min=0 code.max=7
    //% weight=100 blockGap=8
    export function CreateCustomChar(code: number, fontList: number[]) {
        cmd(0x40 | (code & 0x7) << 3);
        let buf = pins.createBuffer(9);
        buf[0] = 0x40
        for (let i = 0; i < 8; i++) {
            buf[i + 1] = fontList[i];
        }
        pins.i2cWriteBuffer(i2cAddr, buf);
        basic.pause(5)
    }

    /**
     * 在液晶的指定位置显示自定义字符
     * @param s is string will be show, [0 - 7], eg: 0
     * @param x is LCD column position, [0 - 15], eg: 0
     * @param y is LCD row position, [0 - 1], eg: 0
     */
    //% blockId="I2C_LCD1602_SHOW_STRING_MY" block="显示 自定义字符 %s|位置 x %x|y %y"
    //% weight=90 blockGap=8
    //% s.min=0 s.max=7
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function ShowString_MY(s: number, x: number, y: number): void {
        setCursor(x, y);
        dat(s)
    }
    // 设置光标位置
    function setCursor(col: number, row: number) {
        col = (row == 0 ? col | 0x80 : col | 0xc0);
        cmd(col)
    }
    // send command
    function cmd(d: number) {
        pins.i2cWriteNumber(i2cAddr, 0x8000 | d, 9)
        //basic.pause(1)
    }
    // send data
    function dat(d: number) {
        pins.i2cWriteNumber(i2cAddr, 0x4000 | d, 9)
        //basic.pause(1)
    }
}

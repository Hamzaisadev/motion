import { mixComplex } from "../complex"

test("mixComplex", () => {
    expect(mixComplex("20px", "10px")(0.5)).toBe("15px")
    expect(
        mixComplex(
            "20px, rgba(0, 0, 0, 0)",
            "10px, rgba(255, 255, 255, 1)"
        )(0.5)
    ).toBe("15px, rgba(180, 180, 180, 0.5)")
    expect(mixComplex("20px, #0000", "10px, #ffff")(0.5)).toBe(
        "15px, rgba(180, 180, 180, 0.5)"
    )
})

test("mixComplex gracefully handles numbers", () => {
    expect(mixComplex(20, "10")(0.5)).toBe("15")
})

test("mixComplex errors", () => {
    expect(mixComplex("hsla(100%, 100, 100, 1)", "#fff")(0)).toBe(
        "rgba(255, 255, 255, 1)"
    )
    expect(mixComplex("hsla(100%, 100, 100, 1)", "#fff")(0.1)).toBe(
        "rgba(255, 255, 255, 1)"
    )
})

test("mixComplex mixes var() and unit types", () => {
    expect(mixComplex("var(--test) 0px", "var(--test) 20px")(0.5)).toBe(
        "var(--test) 10px"
    )
    expect(mixComplex("var(--test-1) 10px", "var(--test-9) 60px")(0.5)).toBe(
        "var(--test-9) 35px"
    )
})

test("mixComplex can interpolate out-of-order values", () => {
    expect(mixComplex("#fff 0px 0px", "20px 0px #000")(0.5)).toBe(
        "10px 0px rgba(180, 180, 180, 1)"
    )
})

test("mixComplex can animate from a value-less prop", () => {
    expect(mixComplex("#fff 0 0px", "#000 20px 0px")(0.5)).toBe(
        "rgba(180, 180, 180, 1) 10px 0px"
    )
})

test("mixComplex can animate from a value with extra zeros", () => {
    expect(mixComplex("#fff 0 0px 0px", "20px 0px #000")(0.5)).toBe(
        "10px 0px rgba(180, 180, 180, 1)"
    )
})

test("mixComplex will only interpolate values outside of CSS variables", () => {
    const mixer = mixComplex(
        "#fff 0 var(--grey, 0px) 10px",
        "#000 0 var(--grey, 10px) 0px"
    )
    expect(mixer(0)).toBe("rgba(255, 255, 255, 1) 0 var(--grey, 0px) 10px")
    expect(mixer(0.5)).toBe("rgba(180, 180, 180, 1) 0 var(--grey, 10px) 5px")
    expect(mixer(1)).toBe("rgba(0, 0, 0, 1) 0 var(--grey, 10px) 0px")
})

test("mixComplex reads numbers written in exponent notation", () => {
    expect(
        mixComplex(
            "translateX(1e-7px) rotate(10deg)",
            "translateX(100px) rotate(20deg)"
        )(0.5)
    ).toBe("translateX(50px) rotate(15deg)")
    expect(mixComplex("blur(2.5e-7px)", "blur(4px)")(0.5)).toBe("blur(2px)")
    expect(mixComplex("2E2px 1e+1px", "0px 0px")(0.5)).toBe("100px 5px")
    expect(
        mixComplex(
            "0px 1.6e-8px 3.2e-8px rgba(161, 0, 246, 6.4e-10)",
            "0px 10px 20px rgba(0, 0, 0, 0.4)"
        )(0.25)
    ).toBe(
        mixComplex(
            "0px 0px 0px rgba(161, 0, 246, 0)",
            "0px 10px 20px rgba(0, 0, 0, 0.4)"
        )(0.25)
    )
})

test("mixComplex doesn't treat units starting with e as exponents", () => {
    expect(mixComplex("1em 2ex", "3em 4ex")(0.5)).toBe("2em 3ex")
})

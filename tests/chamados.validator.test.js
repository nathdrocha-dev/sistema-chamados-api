const {
    validarCriacaoChamado,
    validarAtualizacaoChamado
} = require("../src/validators/chamados.validator");

const AppError = require("../src/errors/AppError");

describe("Validator de criação de chamados", () => {

    const dadosValidos = {
        titulo: "Computador não liga",
        descricao: "O computador não está inicializando",
        solicitante: "Carlos",
        categoria: "Hardware",
        prioridade: "Alta"
    };

    test("Deve aceitar dados válidos", () => {
        const resultado = validarCriacaoChamado(dadosValidos);

        expect(resultado).toEqual(dadosValidos);
    });

    test("Deve rejeitar título vazio", () => {
        const dados = {
            ...dadosValidos,
            titulo: ""
        };

        expect(() => validarCriacaoChamado(dados))
            .toThrow(AppError);
    });

    test("Deve rejeitar título com apenas espaços", () => {
        const dados = {
            ...dadosValidos,
            titulo: "   "
        };

        expect(() => validarCriacaoChamado(dados))
            .toThrow(AppError);
    });

    test("Deve rejeitar descrição numérica", () => {
        const dados = {
            ...dadosValidos,
            descricao: 123
        };

        expect(() => validarCriacaoChamado(dados))
            .toThrow(AppError);
    });

    test("Deve rejeitar título maior que 150 caracteres", () => {
        const dados = {
            ...dadosValidos,
            titulo: "A".repeat(151)
        };

        expect(() => validarCriacaoChamado(dados))
            .toThrow(AppError);
    });

    test("Deve rejeitar categoria inválida", () => {
        const dados = {
            ...dadosValidos,
            categoria: "Financeiro"
        };

        expect(() => validarCriacaoChamado(dados))
            .toThrow(AppError);
    });

    test("Deve rejeitar prioridade inválida", () => {
        const dados = {
            ...dadosValidos,
            prioridade: "Urgente"
        };

        expect(() => validarCriacaoChamado(dados))
            .toThrow(AppError);
    });

    test("Deve remover espaços extras dos textos", () => {
        const dados = {
            ...dadosValidos,
            titulo: "  Computador não liga  "
        };

        const resultado = validarCriacaoChamado(dados);

        expect(resultado.titulo).toBe("Computador não liga");
    });

});
describe("Validator de atualização de chamados", () => {

    test("Deve aceitar status válido", () => {
        const resultado = validarAtualizacaoChamado({
            status: "Em andamento"
        });

        expect(resultado).toEqual({
            status: "Em andamento"
        });
    });

    test("Deve rejeitar status inválido", () => {
        expect(() => validarAtualizacaoChamado({
            status: "Cancelado"
        })).toThrow(AppError);
    });

    test("Deve rejeitar status vazio", () => {
        expect(() => validarAtualizacaoChamado({
            status: ""
        })).toThrow(AppError);
    });

    test("Deve rejeitar status numérico", () => {
        expect(() => validarAtualizacaoChamado({
            status: 123
        })).toThrow(AppError);
    });

    test("Deve rejeitar objeto sem status", () => {
        expect(() => validarAtualizacaoChamado({}))
            .toThrow(AppError);
    });

});

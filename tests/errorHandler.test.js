
const errorHandler = require("../src/middlewares/errorHandler");
const AppError = require("../src/errors/AppError");

describe("Middleware global de erros", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};

        res = {
            headersSent: false,
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    test("Deve tratar AppError com status 400", () => {
        const erro = new AppError("Dados inválidos", 400);

        errorHandler(erro, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Dados inválidos"
        });
        expect(next).not.toHaveBeenCalled();
    });

    test("Deve tratar AppError com status 404", () => {
        const erro = new AppError("Chamado não encontrado", 404);

        errorHandler(erro, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            mensagem: "Chamado não encontrado"
        });
    });

    test("Deve retornar 500 para erros inesperados", () => {
        const erro = new Error("Falha inesperada");
        const consoleSpy = jest.spyOn(console, "error")
            .mockImplementation(() => {});

        try {
            errorHandler(erro, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                mensagem: "Erro interno do servidor"
            });
            expect(consoleSpy).toHaveBeenCalledWith(
                "Erro interno:",
                erro
            );
        } finally {
            consoleSpy.mockRestore();
        }
    });

    test("Deve encaminhar erro quando headers já foram enviados", () => {
        const erro = new Error("Erro após resposta");

        res.headersSent = true;

        errorHandler(erro, req, res, next);

        expect(next).toHaveBeenCalledWith(erro);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
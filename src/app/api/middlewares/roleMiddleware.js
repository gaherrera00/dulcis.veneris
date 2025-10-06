export function roleMiddleware(req, res, next) {
    const { user } = req;
    const { perfil } = req.body; // perfil da conta que está sendo criada

    if (!user || !user.perfil) {
        return res.status(403).json({ message: "Usuário não autenticado" });
    }

    if (perfil === "GERENTE" && user.perfil !== "ADMIN") {
        return res.status(403).json({ message: "Apenas admin pode criar gerente" });
    }

    if (perfil === "CAIXA" && !["ADMIN", "GERENTE"].includes(user.perfil)) {
        return res.status(403).json({ message: "Apenas admin ou gerente podem criar caixa" });
    }

    next();
}

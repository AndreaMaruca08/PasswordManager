import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { userRepository } from "../../index";
import { Logger } from "../../shared/Logger";

interface JwtPayload {
    userId: number;
}

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};
// filtro passport per controllare
passport.use(new JwtStrategy(opts, async (jwt_payload:JwtPayload, done) => {
        try {
            const user = await userRepository.getById(jwt_payload.userId);
            if (!user) return done(null, false, { message: 'Utente non trovato' });

            return done(null, user);
        }catch (error){
            Logger.err("Errore JWT con id utente: " + jwt_payload.userId);
            return done(error, false);
        }
}));

export default passport;
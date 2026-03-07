import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { userRepository } from "../../index";
import { Logger } from "../../common/Logger";

interface JwtPayload {
    userId: number;
}

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

passport.use(new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
        try {
            const user = await userRepository.getById(jwt_payload.userId);
            if (!user) return done(null, false, { message: 'Utente non trovato' });

            return done(null, user);
        }catch (error){
            Logger.err("Errore JWT");
            return done(error, false);
        }
}));

export default passport;
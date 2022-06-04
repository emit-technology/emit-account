import * as db from '../db'
import {ChainType, Token} from "../types";

class TokenCache {

    private _tokensEth: Array<Token> = [];
    private _tokensBsc: Array<Token> = [];

    init = async () => {
        {
            const _data = await db.bsc.getTokens();
            this._tokensBsc.push(..._data);
        }
        {
            const _data = await db.eth.getTokens();
            this._tokensEth.push(..._data);
        }
    }

    all = (chain: ChainType): Array<Token> => {
        return chain == ChainType.BSC ? this._tokensBsc : chain == ChainType.ETH ? this._tokensEth : [];
    }

    get = (tokenAddress: string, chain: ChainType): Token | null => {
        const tokens = this.all(chain);
        const rest = tokens.filter((value, index) => {
            if (value.address.toLowerCase() == tokenAddress.toLowerCase()) {
                return value
            }
        })
        if (rest && rest.length > 0) {
            return rest[0]
        }
        return null
    }

}

export const tokenCache = new TokenCache();
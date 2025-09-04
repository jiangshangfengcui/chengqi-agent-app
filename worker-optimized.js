
// Cloudflare Workers 优化版本
// Auto-generated from Mastra build output

// === 导入必要的依赖 ===
import { M as MastraError, e as executeHook, z as z$1, x as xid, _ as _void, u as uuidv7, a as uuidv6, b as uuidv4, c as uuid, d as url, f as _uppercase, g as unknown, h as union, i as _undefined, j as ulid, k as uint64, l as uint32, t as tuple, m as _trim, n as treeifyError, o as transform, p as _toUpperCase, q as _toLowerCase, r as toJSONSchema, s as templateLiteral, v as symbol$1, w as superRefine, y as success, A as stringbool, B as stringFormat, C as string$1, D as strictObject, E as _startsWith, F as _size, G as set, H as safeParseAsync, I as safeParse, J as registry, K as regexes, L as _regex, N as refine, O as record, P as readonly, Q as _property, R as promise, S as prettifyError, T as preprocess, U as prefault, V as _positive, W as pipe, X as partialRecord, Y as parseAsync, Z as parse, $ as _overwrite, a0 as optional, a1 as object, a2 as number$1, a3 as nullish, a4 as nullable, a5 as _null, a6 as _normalize, a7 as _nonpositive, a8 as nonoptional, a9 as _nonnegative, aa as never, ab as _negative, ac as nativeEnum, ad as nanoid, ae as nan, af as _multipleOf, ag as _minSize, ah as _minLength, ai as _mime, aj as _maxSize, ak as _maxLength, al as map, am as _lte, an as _lt, ao as _lowercase, ap as looseObject, aq as literal, ar as _length, as as lazy, at as ksuid, au as keyof, av as jwt, aw as json, ax as iso, ay as ipv6, az as ipv4, aA as intersection, aB as int64, aC as int32, aD as int, aE as _instanceof, aF as _includes, aG as guid, aH as _gte, aI as _gt, aJ as globalRegistry, aK as formatError, aL as float64, aM as float32, aN as flattenError, aO as file, aP as _enum, aQ as _endsWith, aR as emoji, aS as email, aT as e164, aU as discriminatedUnion, aV as date$1, aW as custom, aX as cuid2, aY as cuid, aZ as config, a_ as clone, a$ as cidrv6, b0 as cidrv4, b1 as check, b2 as _catch, b3 as boolean$1, b4 as bigint$1, b5 as base64url, b6 as base64, b7 as array, b8 as any, b9 as _default, ba as _ZodString, bb as ZodXID, bc as ZodVoid, bd as ZodUnknown, be as ZodUnion, bf as ZodUndefined, bg as ZodUUID, bh as ZodURL, bi as ZodULID, bj as ZodType, bk as ZodTuple, bl as ZodTransform, bm as ZodTemplateLiteral, bn as ZodSymbol, bo as ZodSuccess, bp as ZodStringFormat, bq as ZodString, br as ZodSet, bs as ZodRecord, bt as ZodRealError, bu as ZodReadonly, bv as ZodPromise, bw as ZodPrefault, bx as ZodPipe, by as ZodOptional, bz as ZodObject, bA as ZodNumberFormat, bB as ZodNumber, bC as ZodNullable, bD as ZodNull, bE as ZodNonOptional, bF as ZodNever, bG as ZodNanoID, bH as ZodNaN, bI as ZodMap, bJ as ZodLiteral, bK as ZodLazy, bL as ZodKSUID, bM as ZodJWT, bN as ZodIntersection, bO as ZodISOTime, bP as ZodISODuration, bQ as ZodISODateTime, bR as ZodISODate, bS as ZodIPv6, bT as ZodIPv4, bU as ZodGUID, bV as ZodFile, bW as ZodError, bX as ZodEnum, bY as ZodEmoji, bZ as ZodEmail, b_ as ZodE164, b$ as ZodDiscriminatedUnion, c0 as ZodDefault, c1 as ZodDate, c2 as ZodCustomStringFormat, c3 as ZodCustom, c4 as ZodCatch, c5 as ZodCUID2, c6 as ZodCUID, c7 as ZodCIDRv6, c8 as ZodCIDRv4, c9 as ZodBoolean, ca as ZodBigIntFormat, cb as ZodBigInt, cc as ZodBase64URL, cd as ZodBase64, ce as ZodArray, cf as ZodAny, cg as TimePrecision, ch as NEVER, ci as $output, cj as $input, ck as $brand, cl as _unknown, cm as _tuple, cn as _array, co as $ZodUnknown, cp as $ZodArray, cq as version, cr as util, cs as toDotPath, ct as safeParseAsync$1, cu as safeParse$1, cv as parseAsync$1, cw as parse$1, cx as isValidJWT, cy as isValidBase64URL, cz as isValidBase64, cA as globalConfig, cB as _xid, cC as _void$1, cD as _uuidv7, cE as _uuidv6, cF as _uuidv4, cG as _uuid, cH as _url, cI as _union, cJ as _undefined$1, cK as _ulid, cL as _uint64, cM as _uint32, cN as _transform, cO as _templateLiteral, cP as _symbol, cQ as _success, cR as _stringbool, cS as _stringFormat, cT as _string, cU as _set, cV as _safeParseAsync, cW as _safeParse, cX as _refine, cY as _record, cZ as _readonly, c_ as _promise, c$ as _pipe, d0 as _parseAsync, d1 as _parse$1, d2 as _optional, d3 as _number, d4 as _nullable, d5 as _null$1, d6 as _nonoptional, d7 as _never, d8 as _nativeEnum, d9 as _nanoid, da as _nan, db as _map, dc as _literal, dd as _lazy, de as _ksuid, df as _jwt, dg as _isoTime, dh as _isoDuration, di as _isoDateTime, dj as _isoDate, dk as _ipv6, dl as _ipv4, dm as _intersection, dn as _int64, dp as _int32, dq as _int, dr as _guid, ds as _float64, dt as _float32, du as _file, dv as _enum$1, dw as _emoji, dx as _email, dy as _e164, dz as _discriminatedUnion, dA as _default$1, dB as _date, dC as _custom, dD as _cuid2, dE as _cuid, dF as _coercedString, dG as _coercedNumber, dH as _coercedDate, dI as _coercedBoolean, dJ as _coercedBigint, dK as _cidrv6, dL as _cidrv4, dM as _catch$1, dN as _boolean, dO as _bigint, dP as _base64url, dQ as _base64, dR as _any, dS as JSONSchemaGenerator, dT as Doc, dU as $constructor, dV as $ZodXID, dW as $ZodVoid, dX as $ZodUnion, dY as $ZodUndefined, dZ as $ZodUUID, d_ as $ZodURL, d$ as $ZodULID, e0 as $ZodType, e1 as $ZodTuple, e2 as $ZodTransform, e3 as $ZodTemplateLiteral, e4 as $ZodSymbol, e5 as $ZodSuccess, e6 as $ZodStringFormat, e7 as $ZodString, e8 as $ZodSet, e9 as $ZodRegistry, ea as $ZodRecord, eb as $ZodRealError, ec as $ZodReadonly, ed as $ZodPromise, ee as $ZodPrefault, ef as $ZodPipe, eg as $ZodOptional, eh as $ZodObject, ei as $ZodNumberFormat, ej as $ZodNumber, ek as $ZodNullable, el as $ZodNull, em as $ZodNonOptional, en as $ZodNever, eo as $ZodNanoID, ep as $ZodNaN, eq as $ZodMap, er as $ZodLiteral, es as $ZodLazy, et as $ZodKSUID, eu as $ZodJWT, ev as $ZodIntersection, ew as $ZodISOTime, ex as $ZodISODuration, ey as $ZodISODateTime, ez as $ZodISODate, eA as $ZodIPv6, eB as $ZodIPv4, eC as $ZodGUID, eD as $ZodFile, eE as $ZodError, eF as $ZodEnum, eG as $ZodEmoji, eH as $ZodEmail, eI as $ZodE164, eJ as $ZodDiscriminatedUnion, eK as $ZodDefault, eL as $ZodDate, eM as $ZodCustomStringFormat, eN as $ZodCustom, eO as $ZodCheckUpperCase, eP as $ZodCheckStringFormat, eQ as $ZodCheckStartsWith, eR as $ZodCheckSizeEquals, eS as $ZodCheckRegex, eT as $ZodCheckProperty, eU as $ZodCheckOverwrite, eV as $ZodCheckNumberFormat, eW as $ZodCheckMultipleOf, eX as $ZodCheckMinSize, eY as $ZodCheckMinLength, eZ as $ZodCheckMimeType, e_ as $ZodCheckMaxSize, e$ as $ZodCheckMaxLength, f0 as $ZodCheckLowerCase, f1 as $ZodCheckLessThan, f2 as $ZodCheckLengthEquals, f3 as $ZodCheckIncludes, f4 as $ZodCheckGreaterThan, f5 as $ZodCheckEndsWith, f6 as $ZodCheckBigIntFormat, f7 as $ZodCheck, f8 as $ZodCatch, f9 as $ZodCUID2, fa as $ZodCUID, fb as $ZodCIDRv6, fc as $ZodCIDRv4, fd as $ZodBoolean, fe as $ZodBigIntFormat, ff as $ZodBigInt, fg as $ZodBase64URL, fh as $ZodBase64, fi as $ZodAsyncError, fj as $ZodAny, fk as joinValues, fl as stringifyPrimitive, fm as zodToJsonSchema, fn as isVercelTool, fo as generateEmptyFromSchema, fp as Tool, fq as Telemetry, fr as Agent, fs as AISpanType, ft as mastra, fu as registerHook, fv as AvailableHooks, fw as checkEvalStorageFields, fx as TABLE_EVALS } from './mastra.mjs';
import crypto$1, { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path/posix';
import { Readable, Writable } from 'stream';
import { join as join$1 } from 'path';
import util$1 from 'util';
import { Buffer as Buffer$1 } from 'buffer';
import { ReadableStream as ReadableStream$1 } from 'stream/web';
import { tools } from './tools.mjs';
import 'events';
import 'pino';
import 'pino-pretty';
import '@libsql/client';

// === 核心函数 ===
async function createHonoServer(mastra, options = {
  tools: {}
}

function getToolExports(tools) {
  try {
    return tools.reduce((acc, toolModule) => {
      Object.entries(toolModule).forEach(([key, tool]) => {
        if (tool instanceof Tool) {
          acc[key] = tool;
        }
      });
      return acc;
    }, {});
  } catch (err) {
    console.error(
      `Failed to import tools
reason: ${err.message}
${err.stack.split("\n").slice(1).join("\n")}
    `,
      err
    );
  }
}

// === Worker 入口点 ===
export default {
  async fetch(request, env, ctx) {
    try {
      // 设置环境变量
      setupEnvironmentVariables(env);
      
      // 创建应用实例
      const app = await createWorkerHandler();
      
      // 处理请求
      return await app.fetch(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message,
          stack: error.stack 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },
};

// === 辅助函数 ===
function setupEnvironmentVariables(env) {
  globalThis.process = globalThis.process || {};
  globalThis.process.env = globalThis.process.env || {};
  
  if (env.DEEPSEEK_API_KEY) {
    globalThis.process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
  }
  if (env.OPENAI_API_KEY) {
    globalThis.process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }
}

async function createWorkerHandler() {
  const { mastra } = await import('./src/mastra/index.js');
  
  return await createHonoServer(mastra, {
    playground: true,
    isDev: false,
    tools: getToolExports({}),
  });
}

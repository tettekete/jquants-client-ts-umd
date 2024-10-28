
// @ts-check
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin'

// Base configuration without rules and files
const _base_config =
{
	languageOptions: {
		parser: tsParser,
		globals: {
			...globals.browser,
			...globals.node
		}
	},
	plugins: {
		'@typescript-eslint': tseslint,
		'@stylistic': stylistic,
	},
}


// ESLint and TSESLint recommended system rules and their adjustments
const _base_rules = {
	...eslint.configs.recommended.rules,
	...tseslint.configs.recommended.rules,
	'no-unused-vars': 'off',					// off because it is covered by typescript type checking
	'@typescript-eslint/no-unused-vars': 'off',	// ditto
};


// sharing rules in src/ and tests/
const shared_rules = {
	'prefer-const': 'warn',		// 一度しか使われない変数が const 宣言じゃ無い場合 warn
	'@stylistic/brace-style': ['error', 'allman' ,{ allowSingleLine: true }], // 関数ブロックに  allman スタイルを強制
}


// config for src/**/*.ts
const config_for_src_ts = {
	files: ['src/**/*.ts'],
	..._base_config,
	rules: {
		..._base_rules,
		...shared_rules,
		'@stylistic/semi': ['error', 'always' ,{omitLastInOneLineBlock: true}],  // セミコロン必須
	}
};


// config for tests/**/*.ts
const config_for_tests_ts = {
	files: ['tests/**/*.ts'],
	..._base_config,
	rules: {
		..._base_rules,
		...shared_rules,
		'no-console': 'off',  // テストコードでは console 出力を許容
		'@typescript-eslint/ban-ts-comment': 'off',
		'@stylistic/semi': ['warn', 'always' ,{omitLastInOneLineBlock: true}],  // セミコロンは warn
	}
};


export default [
	config_for_src_ts,
	config_for_tests_ts,
];

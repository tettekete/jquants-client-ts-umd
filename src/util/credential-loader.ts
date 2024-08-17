import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

// クレデンシャル情報を格納するインターフェース
interface Credentials {
  user: string;
  password: string;
  [key: string]: any;
}

// YAML ファイルの読み込み関数
export function loadCredential(filePath: string = 'credentials.yaml'): Credentials {
  const file = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8');
  const creds: Credentials = yaml.parse(file);
  return creds;
}

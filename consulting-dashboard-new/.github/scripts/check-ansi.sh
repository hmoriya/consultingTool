#!/bin/bash
# check-ansi.sh - ANSIエスケープシーケンスの検出と除去

set -e

# ヘルプ表示
show_help() {
    cat << EOF
Usage: $0 [OPTIONS] <file>

ANSIエスケープシーケンスの検出と除去を行います。

OPTIONS:
    -h, --help      このヘルプを表示
    -c, --check     チェックのみ（除去は行わない）
    -f, --fix       検出されたANSIエスケープシーケンスを除去
    -o, --output    出力ファイル名（デフォルト: 元ファイル.clean）

EXAMPLES:
    $0 -c issue-draft.md                    # チェックのみ
    $0 -f issue-draft.md                    # 除去して上書き
    $0 -f -o clean.md issue-draft.md        # clean.mdに出力

EXIT CODES:
    0: ANSIエスケープシーケンスなし、または除去成功
    1: ANSIエスケープシーケンス検出（チェックモード時）
    2: エラー（ファイル不存在など）
EOF
}

# デフォルト設定
CHECK_ONLY=false
FIX_MODE=false
OUTPUT_FILE=""
INPUT_FILE=""

# 引数解析
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--check)
            CHECK_ONLY=true
            shift
            ;;
        -f|--fix)
            FIX_MODE=true
            shift
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -*)
            echo "Unknown option $1" >&2
            exit 2
            ;;
        *)
            if [ -z "$INPUT_FILE" ]; then
                INPUT_FILE="$1"
            else
                echo "Too many arguments" >&2
                exit 2
            fi
            shift
            ;;
    esac
done

# 入力ファイルチェック
if [ -z "$INPUT_FILE" ]; then
    echo "エラー: 入力ファイルが指定されていません" >&2
    echo "使用方法: $0 [OPTIONS] <file>" >&2
    exit 2
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "エラー: ファイル '$INPUT_FILE' が見つかりません" >&2
    exit 2
fi

# 出力ファイル設定（修正モードの場合）
if [ "$FIX_MODE" = true ] && [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="${INPUT_FILE}.clean"
fi

# ANSIエスケープシーケンス検出関数
check_ansi() {
    local file="$1"
    local count

    # ANSIエスケープシーケンスを検出
    count=$(grep -c $'\x1b\[[0-9;]*m' "$file" 2>/dev/null || echo 0)

    if [ "$count" -gt 0 ]; then
        echo "❌ ANSIエスケープシーケンスが検出されました"
        echo "対象ファイル: $file"
        echo "検出数: $count 箇所"
        echo ""
        echo "検出された箇所:"
        grep -n --color=never $'\x1b\[[0-9;]*m' "$file" | head -5
        if [ "$count" -gt 5 ]; then
            echo "... (他 $((count - 5)) 箇所)"
        fi
        return 1
    else
        echo "✅ ANSIエスケープシーケンスは検出されませんでした"
        echo "対象ファイル: $file"
        return 0
    fi
}

# ANSIエスケープシーケンス除去関数
fix_ansi() {
    local input_file="$1"
    local output_file="$2"

    echo "🔧 ANSIエスケープシーケンスを除去しています..."
    echo "入力: $input_file"
    echo "出力: $output_file"

    # ANSIエスケープシーケンスを除去
    sed 's/\x1b\[[0-9;]*m//g' "$input_file" > "$output_file"

    # 除去結果を確認
    local original_count
    local fixed_count

    original_count=$(grep -c $'\x1b\[[0-9;]*m' "$input_file" 2>/dev/null || echo 0)
    fixed_count=$(grep -c $'\x1b\[[0-9;]*m' "$output_file" 2>/dev/null || echo 0)

    if [ "$fixed_count" -eq 0 ]; then
        echo "✅ ANSIエスケープシーケンスの除去が完了しました"
        echo "除去数: $original_count 箇所"

        if [ "$input_file" != "$output_file" ]; then
            echo ""
            echo "修正されたファイルを確認してください:"
            echo "  diff -u '$input_file' '$output_file'"
            echo ""
            echo "問題なければ元ファイルを置き換えてください:"
            echo "  mv '$output_file' '$input_file'"
        fi
        return 0
    else
        echo "❌ ANSIエスケープシーケンスの除去に失敗しました"
        echo "残存数: $fixed_count 箇所"
        return 1
    fi
}

# メイン処理
main() {
    echo "=== ANSIエスケープシーケンス検出・除去ツール ==="
    echo ""

    if [ "$CHECK_ONLY" = true ]; then
        # チェックのみモード
        if check_ansi "$INPUT_FILE"; then
            echo ""
            echo "✅ このファイルはGitHub Issueで正しく表示されます"
            exit 0
        else
            echo ""
            echo "⚠️ このファイルをGitHub Issueで使用すると文字化けする可能性があります"
            echo ""
            echo "修正するには以下のコマンドを実行してください:"
            echo "  $0 -f '$INPUT_FILE'"
            exit 1
        fi
    elif [ "$FIX_MODE" = true ]; then
        # 修正モード
        echo "🔍 ANSIエスケープシーケンスをチェックしています..."

        if check_ansi "$INPUT_FILE"; then
            echo ""
            echo "✅ 修正の必要はありません"
            exit 0
        else
            echo ""
            fix_ansi "$INPUT_FILE" "$OUTPUT_FILE"
        fi
    else
        # デフォルト: チェックのみ
        check_ansi "$INPUT_FILE"

        if [ $? -ne 0 ]; then
            echo ""
            echo "修正する場合は -f オプションを使用してください:"
            echo "  $0 -f '$INPUT_FILE'"
            exit 1
        fi
    fi
}

# スクリプト実行
main "$@"
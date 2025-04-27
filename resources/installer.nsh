!define APP_NAME "BoliFlow"  # 替换为你的应用名

Function .onVerifyInstDir
  StrLen $0 "\${APP_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0  # 截取路径末尾
  StrCmp $1 "\${APP_NAME}" +2 0  # 检查是否已包含应用名
  StrCpy $INSTDIR "$INSTDIR\${APP_NAME}"  # 自动追加
FunctionEnd
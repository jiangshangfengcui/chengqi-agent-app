// 演示文件 - 包含多种代码质量问题
var userName = "admin";  // 使用 var 而不是 const/let

function authenticateUser(password) {
  // 安全问题：使用 eval
  if (password == "secret") {  // 使用 == 而不是 ===
    eval("console.log('User authenticated')");  // 危险的 eval 使用
    
    // XSS 漏洞
    document.getElementById("welcome").innerHTML = "Welcome " + userName;
    
    return true;
  }
  
  // TODO: 添加密码复杂度检查
  // FIXME: 修复弱密码验证逻辑
  
  return false;
}

// 性能问题：循环中重复访问 length
function processItems() {
  var items = document.getElementsByClassName("item");
  for (var i = 0; i < items.length; i++) {
    // 重复的 DOM 查询
    document.getElementById("status").innerHTML = "Processing...";
    items[i].style.display = "block";
  }
  
  // 赋值在条件语句中
  if (currentUser = getActiveUser()) {
    console.log("Current user:", currentUser);
  }
}

// 复杂的函数 - 高圈复杂度
function complexFunction(data) {
  if (data.type === "user") {
    if (data.status === "active") {
      if (data.role === "admin") {
        if (data.permissions.includes("read")) {
          if (data.permissions.includes("write")) {
            if (data.permissions.includes("delete")) {
              return "full_access";
            } else {
              return "read_write";
            }
          } else {
            return "read_only";
          }
        }
      } else if (data.role === "user") {
        if (data.verified) {
          return "user_access";
        }
      }
    } else if (data.status === "inactive") {
      return "no_access";
    }
  } else if (data.type === "guest") {
    return "guest_access";
  }
  
  return "unknown";
}
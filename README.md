1、TypeScript
2、Angular
4、ant-design-pro、ng-alain
5、nodejs-18.17.1、angular-16、ant-design-pro-16.2
  https://jun-tech.github.io/ng-ant-design-pro-platform/


# Gen sourcecode
#!/bin/bash
echo "🚀 Generating Angular modules, components, and routes..."

# 1. Dashboard
ng g m home --routing --module app.module
ng g c home/dashboard

# 2. Subscribers
ng g m subscribers --routing --module app.module
ng g c subscribers/subscriber
ng g c subscribers/tag
ng g c subscribers/import

# 3. Send
ng g m email --routing --module app.module
ng g c email/templates
ng g c email/campaigns
ng g c email/sequences

# 4. Workflows
ng g m workflows --routing --module app.module
ng g c workflows/main
ng g c workflows/workflow-builder

# 5. Settings
ng g m settings --routing --module app.module
ng g c settings/main  # Hoặc chỉ settings nếu bạn không chia nhỏ



rm -rf node_modules package-lock.json dist .angular

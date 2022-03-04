import { shell, read, exists } from '../../utils'

const requirements = () => {
  return exists('package.json') && exists('package-lock.json')
}

const metrics = () => {
  const npm_package = JSON.parse(read('package.json'))
  const npm_audit = JSON.parse(shell('npm audit --json'))

  const npm_audit_by_dependencies = npm_audit['metadata']['dependencies']
  const npm_audit_by_severity = npm_audit['metadata']['vulnerabilities']

  const npm_number_of_prod_dependencies = npm_package['dependencies']?.keys?.length || 0
  const npm_number_of_dev_dependencies = npm_package['devDependencies']?.keys?.length || 0
  const npm_number_of_scripts = npm_package['scripts']?.keys?.length || 0

  const npm_number_of_vulnerable_dependencies_info = npm_audit_by_severity['info']
  const npm_number_of_vulnerable_dependencies_low = npm_audit_by_severity['low']
  const npm_number_of_vulnerable_dependencies_moderate = npm_audit_by_severity['moderate']
  const npm_number_of_vulnerable_dependencies_high = npm_audit_by_severity['high']
  const npm_number_of_vulnerable_dependencies_critical = npm_audit_by_severity['critical']
  const npm_number_of_vulnerable_dependencies_total = npm_audit_by_severity['total']
  const npm_number_of_computed_prod_dependencies = npm_audit_by_dependencies['prod']
  const npm_number_of_computed_dev_dependencies = npm_audit_by_dependencies['dev']
  const npm_number_of_computed_optional_dependencies = npm_audit_by_dependencies['optional']
  const npm_number_of_computed_peer_dependencies = npm_audit_by_dependencies['peer']
  const npm_number_of_computed_peer_optional_dependencies = npm_audit_by_dependencies['peerOptional']
  const npm_number_of_computed_total_dependencies = npm_audit_by_dependencies['total']

  return {
    npm_number_of_prod_dependencies,
    npm_number_of_dev_dependencies,
    npm_number_of_scripts,
    npm_number_of_computed_prod_dependencies,
    npm_number_of_computed_dev_dependencies,
    npm_number_of_computed_optional_dependencies,
    npm_number_of_computed_peer_dependencies,
    npm_number_of_computed_peer_optional_dependencies,
    npm_number_of_computed_total_dependencies,
    npm_number_of_vulnerable_dependencies_info,
    npm_number_of_vulnerable_dependencies_low,
    npm_number_of_vulnerable_dependencies_moderate,
    npm_number_of_vulnerable_dependencies_high,
    npm_number_of_vulnerable_dependencies_critical,
    npm_number_of_vulnerable_dependencies_total
  }
}

export default {
  requirements,
  metrics
}

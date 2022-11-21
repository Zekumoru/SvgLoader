version=$1

CURRENT_VERSION=$(npm pkg get version)

if [ "$version" == "" ] ; then
  echo Provide a version number! Current version: $CURRENT_VERSION
  exit 1
fi

if [[ ! "\"$version\"" > "$CURRENT_VERSION" ]] ; then 
  echo Version number cannot be lesser than the current version $CURRENT_VERSION
  exit 1
fi 

# Cache dev properties
scripts=$(npm pkg get scripts)
devDependencies=$(npm pkg get devDependencies)
lintStaged=$(npm pkg get lint-staged)
normalizeCss=$(npm pkg get dependencies["normalize.css"])

# Prepare then publish
npm pkg delete scripts devDependencies lint-staged dependencies["normalize.css"]
json -I -f package.json -e "this.version=\"$version\""

npm publish

# Restore dev properties
json -I -f package.json -e "this.scripts=$scripts"
json -I -f package.json -e "this.devDependencies=$devDependencies"
json -I -f package.json -e "this[\"lint-staged\"]=$lintStaged"
json -I -f package.json -e "this.dependencies[\"normalize.css\"]=$normalizeCss"

# Commit publish
git add .
git commit -m "Publish version $version"

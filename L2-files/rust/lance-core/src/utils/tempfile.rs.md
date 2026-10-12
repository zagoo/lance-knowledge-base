> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/tempfile.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `69da2bcce307f24b9790863fe1661647d77697542e407af72c5057a91dffa8dd`. Reviewed physical lines: 1-343.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public RAII temporary directory/file/path wrappers with std, string and object-store representations; dependency cleanup is retained by owning private temp handles. (rust/lance-core/src/utils/tempfile.rs:1-343)

## Complete range analysis

### Lines 1-24

SPDX and module docs explain reducing representation boilerplate and replacing Windows backslashes with slashes to work around a URL parsing issue. The comment explicitly limits this rewrite to temporary paths rather than arbitrary escaping. Imports alias ObjPath/StdPath and bring Deref, PathBuf, NamedTempFile and the local Result into scope. No url parser is called in this file. (rust/lance-core/src/utils/tempfile.rs:1-24)

### Lines 25-44

TempDir derives Debug and owns private tempfile::TempDir. Documentation says cleanup generally occurs on drop. Private new calls tempfile::tempdir().unwrap(), then stores the handle, so creation failure panics on this path. The multiple representations all refer to this same owned directory. (rust/lance-core/src/utils/tempfile.rs:25-44)

### Lines 45-54

Public try_new()->Result<Self> calls tempfile::tempdir()? and returns the handle. Comments recommend Default for tests and this fallible entry point for production. The local Result converts IO failure through the core error conversion; creation failure is not unwrapped here. (rust/lance-core/src/utils/tempfile.rs:45-54)

### Lines 55-65

path_str returns a newly allocated String, unwraps path.to_str (non-Unicode can panic), and on cfg!(windows) replaces every backslash with slash; other targets clone the path text unchanged. The comment calls this safe to use as a URI on Windows, but the function does not add a URI scheme or perform URL percent-encoding. (rust/lance-core/src/utils/tempfile.rs:55-65)

### Lines 66-89

std_path borrows the dependency directory path as &StdPath and preserves platform-native form. obj_path parses path_str into ObjPath and unwraps, so it can panic on Unicode/conversion/parse failure. Default invokes private new and inherits its creation panic. Comments direct Windows URI users toward path_str rather than converting std_path themselves. (rust/lance-core/src/utils/tempfile.rs:66-89)

### Lines 90-124

TempObjDir privately retains TempDir in _tempdir and caches an ObjPath. Deref<Target=ObjPath> and AsRef<ObjPath> borrow that cached path. Default creates the directory through TempDir::default and parses its object-store path, retaining ownership for cleanup. Leading underscore does not drop or disable the temp handle. (rust/lance-core/src/utils/tempfile.rs:90-124)

### Lines 125-147

TempStrDir privately retains TempDir and a String. Display forwards to String::fmt; public as_into_string()->impl Into<String> returns a cloned String. That clone carries the text only, not ownership of the temporary directory, so it does not extend the RAII lifetime. (rust/lance-core/src/utils/tempfile.rs:125-147)

### Lines 148-172

TempStrDir Default constructs TempDir and caches path_str; Deref<Target=String> and AsRef<str> borrow the cache. Default can panic through directory creation/Unicode conversion. No DerefMut or persistence operation is provided. (rust/lance-core/src/utils/tempfile.rs:148-172)

### Lines 173-196

TempStdDir derives Default around a private TempDir. Both AsRef<StdPath> and Deref<Target=StdPath> call its std_path and return a borrow, without separately cached string/object-store conversion. The owning wrapper keeps the directory alive. (rust/lance-core/src/utils/tempfile.rs:173-196)

### Lines 197-213

TempFile owns a private NamedTempFile under the name temppath. Comments say it normally cleans up on drop and may create an empty file, directing nonexistent-path users to TempStdPath. Private new calls NamedTempFile::new().unwrap(), so default creation opens/owns a named file and panics on dependency creation failure. (rust/lance-core/src/utils/tempfile.rs:197-213)

### Lines 214-239

TempFile path_str mirrors TempDir: path.to_str().unwrap(), replace backslashes on Windows, otherwise clone text. std_path borrows the native file path; obj_path parses path_str and unwraps. The conversions are not fallible Result APIs and do not themselves persist or transfer the file handle. (rust/lance-core/src/utils/tempfile.rs:214-239)

### Lines 240-269

TempFile Default calls private new; TempStdFile derives Default around a private TempFile and exposes its native path through AsRef<StdPath> and Deref<Target=StdPath>. No public try_new for TempFile or explicit persistence/close API is defined in this file. (rust/lance-core/src/utils/tempfile.rs:240-269)

### Lines 270-305

TempObjFile is deliberately different: it owns a temporary directory and caches ObjPath::parse(format!("{}/some_file",tempdir.path_str())).unwrap(). It does not create/open the leaf file; AsRef and Deref borrow the cached ObjPath. The comment explains avoiding an open leaf handle that would prevent atomic renames on Windows. Default retains the directory so the leaf location stays owned, and inherits directory/conversion/parse panic paths. (rust/lance-core/src/utils/tempfile.rs:270-305)

### Lines 306-328

TempStdPath likewise creates a TempDir, formats its normalized string with fixed leaf /some_file, converts it to PathBuf, and retains both. The uniqueness claim is based on the newly created parent directory, not a random leaf name. Constructing this wrapper does not create the leaf file. The comment calls its form Windows URI-safe; stored value is a PathBuf rather than a URI type. (rust/lance-core/src/utils/tempfile.rs:306-328)

### Lines 329-343

TempStdPath Deref<Target=PathBuf> borrows the stored path and AsRef<StdPath> calls as_path. Neither transfers the retained TempDir. No local tests, custom Drop implementation, cleanup-result reporting or persist operation appear in this file; cleanup semantics are delegated to the owned tempfile types. (rust/lance-core/src/utils/tempfile.rs:329-343)

## Interaction and interpretation limits

Retaining a cloned string/path after dropping its owner does not preserve the underlying temporary resource. Exact filesystem cleanup, dependency path parsing and platform behavior were not runtime-tested; “generally/normally cleaned” are source documentation qualifications. (rust/lance-core/src/utils/tempfile.rs:25-44; rust/lance-core/src/utils/tempfile.rs:125-172; rust/lance-core/src/utils/tempfile.rs:197-213; rust/lance-core/src/utils/tempfile.rs:270-343)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Utility functions for creating temporary files and directories.
    5 | //!
    6 | //! Most of these types wrap around the `tempfile` crate.  We add two
    7 | //! additional features:
    8 | //!
    9 | //! * There are wrappers around temporary directories and files that expose
   10 | //!   the dir/file as an object store path, std path, or string, which can save
   11 | //!   some boilerplate.
   12 | //! * We work around a current bug in the `url` crate which fails to parse
   13 | //!   Windows paths like `C:\` correctly.  We do so by replacing all `\` with
   14 | //!   `/` in the path.  This is not safe in general (e.g. paths may use `\` as
   15 | //!   an escape) but it should be safe for temporary paths.
   16 | 
   17 | use object_store::path::Path as ObjPath;
   18 | use std::{
   19 |     ops::Deref,
   20 |     path::{Path as StdPath, PathBuf},
   21 | };
   22 | use tempfile::NamedTempFile;
   23 | 
   24 | use crate::Result;
   25 | 
   26 | /// A temporary directory
   27 | ///
   28 | /// This create a temporary directory using [`tempfile::tempdir`].  It will
   29 | /// generally be cleaned up when the object is dropped.
   30 | ///
   31 | /// This type is primarily useful when you need multiple representations (string,
   32 | /// path, object store path) of the same temporary directory.  If you only need
   33 | /// a single representation you can use the [`TempStdDir`], [`TempStrDir`], or
   34 | /// [`TempObjDir`] types.
   35 | #[derive(Debug)]
   36 | pub struct TempDir {
   37 |     tempdir: tempfile::TempDir,
   38 | }
   39 | 
   40 | impl TempDir {
   41 |     fn new() -> Self {
   42 |         let tempdir = tempfile::tempdir().unwrap();
   43 |         Self { tempdir }
   44 |     }
   45 | 
   46 |     /// Create a temporary directory, exposing any potential errors.
   47 |     ///
   48 |     /// For most test cases you should use the [`Default`] implementation instead.
   49 |     /// However, when we use this type in production code, we may want to return
   50 |     /// errors gracefully instead of panicking.
   51 |     pub fn try_new() -> Result<Self> {
   52 |         let tempdir = tempfile::tempdir()?;
   53 |         Ok(Self { tempdir })
   54 |     }
   55 | 
   56 |     /// Get the path as a string
   57 |     ///
   58 |     /// This path will be safe to use as a URI on Windows
   59 |     pub fn path_str(&self) -> String {
   60 |         if cfg!(windows) {
   61 |             self.tempdir.path().to_str().unwrap().replace("\\", "/")
   62 |         } else {
   63 |             self.tempdir.path().to_str().unwrap().to_owned()
   64 |         }
   65 |     }
   66 | 
   67 |     /// Get the path as a standard library path
   68 |     ///
   69 |     /// If you convert this to a string, it will NOT be safe to use as a URI on Windows.
   70 |     /// Use [`TempDir::path_str`] instead.
   71 |     ///
   72 |     /// It is safe to use this as a standard path on Windows.
   73 |     pub fn std_path(&self) -> &StdPath {
   74 |         self.tempdir.path()
   75 |     }
   76 | 
   77 |     /// Get the path as an object store path
   78 |     ///
   79 |     /// This path will be safe to use as a URI on Windows
   80 |     pub fn obj_path(&self) -> ObjPath {
   81 |         ObjPath::parse(self.path_str()).unwrap()
   82 |     }
   83 | }
   84 | 
   85 | impl Default for TempDir {
   86 |     fn default() -> Self {
   87 |         Self::new()
   88 |     }
   89 | }
   90 | 
   91 | /// A temporary directory that is exposed as an object store path
   92 | ///
   93 | /// This is a wrapper around [`TempDir`] that exposes the path as an object store path.
   94 | /// It is useful when you need to create a temporary directory that is only
   95 | /// used as an object store path.
   96 | pub struct TempObjDir {
   97 |     _tempdir: TempDir,
   98 |     path: ObjPath,
   99 | }
  100 | 
  101 | impl Deref for TempObjDir {
  102 |     type Target = ObjPath;
  103 | 
  104 |     fn deref(&self) -> &Self::Target {
  105 |         &self.path
  106 |     }
  107 | }
  108 | 
  109 | impl AsRef<ObjPath> for TempObjDir {
  110 |     fn as_ref(&self) -> &ObjPath {
  111 |         &self.path
  112 |     }
  113 | }
  114 | 
  115 | impl Default for TempObjDir {
  116 |     fn default() -> Self {
  117 |         let tempdir = TempDir::default();
  118 |         let path = tempdir.obj_path();
  119 |         Self {
  120 |             _tempdir: tempdir,
  121 |             path,
  122 |         }
  123 |     }
  124 | }
  125 | 
  126 | /// A temporary directory that is exposed as a string
  127 | ///
  128 | /// This is a wrapper around [`TempDir`] that exposes the path as a string.
  129 | /// It is useful when you need to create a temporary directory that is only
  130 | /// used as a string.
  131 | pub struct TempStrDir {
  132 |     _tempdir: TempDir,
  133 |     string: String,
  134 | }
  135 | 
  136 | impl std::fmt::Display for TempStrDir {
  137 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  138 |         self.string.fmt(f)
  139 |     }
  140 | }
  141 | 
  142 | impl TempStrDir {
  143 |     /// Create a cloned copy of the string that can be used if `Into<String>` is needed
  144 |     pub fn as_into_string(&self) -> impl Into<String> {
  145 |         self.string.clone()
  146 |     }
  147 | }
  148 | 
  149 | impl Default for TempStrDir {
  150 |     fn default() -> Self {
  151 |         let tempdir = TempDir::default();
  152 |         let string = tempdir.path_str();
  153 |         Self {
  154 |             _tempdir: tempdir,
  155 |             string,
  156 |         }
  157 |     }
  158 | }
  159 | 
  160 | impl Deref for TempStrDir {
  161 |     type Target = String;
  162 | 
  163 |     fn deref(&self) -> &Self::Target {
  164 |         &self.string
  165 |     }
  166 | }
  167 | 
  168 | impl AsRef<str> for TempStrDir {
  169 |     fn as_ref(&self) -> &str {
  170 |         self.string.as_ref()
  171 |     }
  172 | }
  173 | 
  174 | /// A temporary directory that is exposed as a standard library path
  175 | ///
  176 | /// This is a wrapper around [`TempDir`] that exposes the path as a standard library path.
  177 | /// It is useful when you need to create a temporary directory that is only
  178 | /// used as a standard library path.
  179 | #[derive(Default)]
  180 | pub struct TempStdDir {
  181 |     tempdir: TempDir,
  182 | }
  183 | 
  184 | impl AsRef<StdPath> for TempStdDir {
  185 |     fn as_ref(&self) -> &StdPath {
  186 |         self.tempdir.std_path()
  187 |     }
  188 | }
  189 | 
  190 | impl Deref for TempStdDir {
  191 |     type Target = StdPath;
  192 | 
  193 |     fn deref(&self) -> &Self::Target {
  194 |         self.tempdir.std_path()
  195 |     }
  196 | }
  197 | 
  198 | /// A temporary file
  199 | ///
  200 | /// This is a wrapper around [`tempfile::NamedTempFile`].  The file will normally be cleaned
  201 | /// up when the object is dropped.
  202 | ///
  203 | /// Note: this function may create an empty file when the object is created.  If you are checking
  204 | /// that the path does not exist, you should use [`TempStdPath`] instead.
  205 | pub struct TempFile {
  206 |     temppath: NamedTempFile,
  207 | }
  208 | 
  209 | impl TempFile {
  210 |     fn new() -> Self {
  211 |         let temppath = tempfile::NamedTempFile::new().unwrap();
  212 |         Self { temppath }
  213 |     }
  214 | 
  215 |     /// Get the path as a string safe to use as a URI on Windows.
  216 |     pub fn path_str(&self) -> String {
  217 |         if cfg!(windows) {
  218 |             self.temppath.path().to_str().unwrap().replace("\\", "/")
  219 |         } else {
  220 |             self.temppath.path().to_str().unwrap().to_owned()
  221 |         }
  222 |     }
  223 | 
  224 |     /// Get the path as a standard library path
  225 |     ///
  226 |     /// If you convert this to a string, it will NOT be safe to use as a URI on Windows.
  227 |     /// Use [`TempFile::path_str`] instead.
  228 |     ///
  229 |     /// It is safe to use this as a standard path on Windows.
  230 |     pub fn std_path(&self) -> &StdPath {
  231 |         self.temppath.path()
  232 |     }
  233 | 
  234 |     /// Get the path as an object store path
  235 |     ///
  236 |     /// This path will be safe to use as a URI on Windows
  237 |     pub fn obj_path(&self) -> ObjPath {
  238 |         ObjPath::parse(self.path_str()).unwrap()
  239 |     }
  240 | }
  241 | 
  242 | impl Default for TempFile {
  243 |     fn default() -> Self {
  244 |         Self::new()
  245 |     }
  246 | }
  247 | 
  248 | /// A temporary file that is exposed as a standard library path
  249 | ///
  250 | /// This is a wrapper around [`TempFile`] that exposes the path as a standard library path.
  251 | /// It is useful when you need to create a temporary file that is only used as a standard library path.
  252 | #[derive(Default)]
  253 | pub struct TempStdFile {
  254 |     tempfile: TempFile,
  255 | }
  256 | 
  257 | impl AsRef<StdPath> for TempStdFile {
  258 |     fn as_ref(&self) -> &StdPath {
  259 |         self.tempfile.std_path()
  260 |     }
  261 | }
  262 | 
  263 | impl Deref for TempStdFile {
  264 |     type Target = StdPath;
  265 | 
  266 |     fn deref(&self) -> &Self::Target {
  267 |         self.tempfile.std_path()
  268 |     }
  269 | }
  270 | 
  271 | /// A unique path to a temporary file, exposed as an object store path
  272 | ///
  273 | /// Unlike [`TempFile`], this does not create an empty file. We create a
  274 | /// temporary directory and then construct a path inside it, following the
  275 | /// same pattern as [`TempStdPath`]. This avoids holding an open file handle,
  276 | /// which on Windows would prevent atomic renames to the same path.
  277 | pub struct TempObjFile {
  278 |     _tempdir: TempDir,
  279 |     path: ObjPath,
  280 | }
  281 | 
  282 | impl AsRef<ObjPath> for TempObjFile {
  283 |     fn as_ref(&self) -> &ObjPath {
  284 |         &self.path
  285 |     }
  286 | }
  287 | 
  288 | impl std::ops::Deref for TempObjFile {
  289 |     type Target = ObjPath;
  290 | 
  291 |     fn deref(&self) -> &Self::Target {
  292 |         &self.path
  293 |     }
  294 | }
  295 | 
  296 | impl Default for TempObjFile {
  297 |     fn default() -> Self {
  298 |         let tempdir = TempDir::default();
  299 |         let path = ObjPath::parse(format!("{}/some_file", tempdir.path_str())).unwrap();
  300 |         Self {
  301 |             _tempdir: tempdir,
  302 |             path,
  303 |         }
  304 |     }
  305 | }
  306 | 
  307 | /// Get a unique path to a temporary file
  308 | ///
  309 | /// Unlike [`TempFile`], this function will not create an empty file.  We create
  310 | /// a temporary directory and then create a path inside of it.  Since the temporary
  311 | /// directory is created first, we can be confident that the path is unique.
  312 | ///
  313 | /// This path will be safe to use as a URI on Windows
  314 | pub struct TempStdPath {
  315 |     _tempdir: TempDir,
  316 |     path: PathBuf,
  317 | }
  318 | 
  319 | impl Default for TempStdPath {
  320 |     fn default() -> Self {
  321 |         let tempdir = TempDir::default();
  322 |         let path = format!("{}/some_file", tempdir.path_str());
  323 |         let path = PathBuf::from(path);
  324 |         Self {
  325 |             _tempdir: tempdir,
  326 |             path,
  327 |         }
  328 |     }
  329 | }
  330 | 
  331 | impl Deref for TempStdPath {
  332 |     type Target = PathBuf;
  333 | 
  334 |     fn deref(&self) -> &Self::Target {
  335 |         &self.path
  336 |     }
  337 | }
  338 | 
  339 | impl AsRef<StdPath> for TempStdPath {
  340 |     fn as_ref(&self) -> &StdPath {
  341 |         self.path.as_path()
  342 |     }
  343 | }
``````

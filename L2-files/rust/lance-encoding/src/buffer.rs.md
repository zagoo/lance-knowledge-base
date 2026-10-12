> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/buffer.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2caf02bff4e023415099bb9167cdea33b894a66308812f0e8cd3c891df4444f7`. Reviewed physical lines: 1-503.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public Arrow-backed owned byte-buffer abstraction, typed views, byte slicing, concatenation, raw-pointer interleaving and owned iteration. Alignment, ownership and unsafe preconditions are separate contracts. (rust/lance-encoding/src/buffer.rs:1-503)

## Complete range analysis

### Lines 1-22

SPDX, module documentation, standard pointer/ownership/Cow and Arrow imports, then public tuple LanceBuffer(Buffer) with private field and Clone,Debug,PartialEq,Eq. Documentation describes copy-on-write and cheap cloning; this file exposes no mutable-data method. Buffer refcounting and underlying allocation behavior are delegated to Arrow. (rust/lance-encoding/src/buffer.rs:1-22)

### Lines 23-44

Public into_buffer consumes wrapper and returns Arrow Buffer without a local copy. all_unset(len) allocates len zero bytes; all_set(len) allocates len bytes of0xff, not a bit count and not a masked final byte. empty creates an empty Vec<u8>-backed Buffer. No length validation or allocation budget. (rust/lance-encoding/src/buffer.rs:23-44)

### Lines 45-61

as_hex returns uppercase hexadecimal. concat borrows a slice of wrappers, sums usize lengths without checked arithmetic, allocates total capacity and copies every visible buffer in order; even a single input is copied. Empty inputs yield empty output. This differs from consuming concat_into_one. (rust/lance-encoding/src/buffer.rs:45-61)

### Lines 62-77

as_spaced_hex doubles bytes_per_word after usize cast, divides hex length by that width for capacity, then inserts one space before each noninitial group. No trailing space. bytes_per_word=0 causes division by zero even for empty input. Cast/product/capacity arithmetic are unchecked; no Result. (rust/lance-encoding/src/buffer.rs:62-77)

### Lines 78-110

from_bytes consumes Bytes and a u64 bytes_per_value. Only power-of-two widths trigger align_offset; a misaligned pointer causes copying through Vec<u8>, otherwise unsafe Buffer::from_custom_allocation retains Bytes via Arc as owner. Non-power-of-two widths bypass alignment testing by design. The copying branch does not explicitly request the supplied alignment from its Vec<u8> allocation, so do not infer a guaranteed typed alignment; later typed access rechecks the actual pointer. No width-zero validation: is_pwr_two uses n&(n-1), whose zero subtraction can panic under overflow checks, and align_offset(0) is invalid if reached. u64->usize cast is unchecked. The custom allocation retains a valid Bytes pointer/lifetime; local SAFETY comment discusses alignment but dependency allocation semantics are not independently inspected. (rust/lance-core/src/utils/bit.rs:8-17) (rust/lance-encoding/src/buffer.rs:78-110)

### Lines 111-129

deep_copy copies visible bytes into fresh owned storage. reinterpret_vec<T:ArrowNativeType> transfers Vec<T> into Arrow Buffer, preserving allocation layout through the dependency rather than constructing a Vec<u8> with the wrong deallocation alignment. It does not serialize or byte-swap values. Documentation explains why naive Vec reinterpretation is unsound. (rust/lance-encoding/src/buffer.rs:111-129)

### Lines 130-143

reinterpret_slice<T:ArrowNativeType+RefUnwindSafe> accepts Arc<[T]>, derives non-null pointer or dangling fallback, computes byte length with size_of_val, and creates custom Arrow allocation retaining the original Arc through another Arc owner. Payload is shared without copying; owner lifetime, not the raw pointer alone, keeps it valid. SAFETY comment says len items although actual length is bytes. No external endianness conversion. (rust/lance-encoding/src/buffer.rs:130-143)

### Lines 144-173

borrow_to_typed_slice<T:ArrowNativeType> returns ScalarBuffer<T>, despite prose mentioning Vec<T>. It panics if byte length is not divisible by size_of<T>. With aligned pointer, clone the Arrow Buffer and construct a shared owning ScalarBuffer. Otherwise allocate Vec<T> capacity, convert to MutableBuffer, append raw bytes and return the resulting typed Arrow storage. The returned handle owns a refcount and can outlive the original wrapper. Alignment is checked against the actual T. Element size is assumed nonzero. This is not a borrowed Rust slice. (rust/lance-encoding/src/buffer.rs:144-173)

### Lines 174-204

borrow_to_typed_view<T:ArrowNativeType+bytemuck::Pod> returns Cow<[T]>. Same divisibility panic; aligned data uses bytemuck::cast_slice and a borrowed view tied to self, unaligned data uses pod_collect_to_vec and owned copy. Documentation motivates avoiding refcount clones on hot paths; no performance measurement here. Neither typed method performs endian conversion or validates a logical Arrow datatype. (rust/lance-encoding/src/buffer.rs:174-204)

### Lines 205-225

concat_into_one consumes Vec<LanceBuffer>; exactly one buffer is moved out unchanged, preserving its allocation. Zero or multiple inputs sum lengths, allocate and copy in order. No checked total/cap or zero-copy multi-buffer composition. (rust/lance-encoding/src/buffer.rs:205-225)

### Lines 226-245

zip_into_one consumes buffers paired with bit widths and a u64 value count. It rejects widths not divisible by8 with InvalidInput including the width; zero width is accepted. Computes per-buffer byte widths, unchecked sum and product, casts total and widths to usize, allocates zeroed output, and retains all input owners while collecting raw pointers. No validation of source length versus num_values*width, integer representability or output arithmetic. (rust/lance-encoding/src/buffer.rs:226-245)

### Lines 246-261

Unsafe zipper loops until output pointer reaches end, copies each source width with copy_nonoverlapping and advances both pointers. For valid inputs it interleaves rows in supplied buffer order and ignores surplus source tails. Safety requires each source contain every requested value and all size/address arithmetic fit; these are not established by this safe public function. Short inputs or overflow can cause out-of-bounds raw access, not merely a Result error. No unsafe probe was executed. Empty buffers, zero rows or all-zero widths produce empty output. Independent output allocation supplies nonoverlap for valid sources. No local SAFETY justification accompanies this block. A lexical production caller is the older packed-struct encoder; it derives count from first field and checks equal counts only with debug_assert, without establishing byte lengths in the inspected snippet. Preserve its frozen legacy boundary. (rust/lance-encoding/src/array_encoding/physical/packed_struct.rs:172-249; AGENTS.md:15-20) (rust/lance-encoding/src/buffer.rs:246-261)

### Lines 262-282

copy_slice and const-generic copy_array allocate owned copies. len delegates to Arrow and allows clippy len_without_is_empty; Deref<[u8]> supplies slice methods separately. as_ptr later exposes the raw visible-byte pointer, without transferring ownership. (rust/lance-encoding/src/buffer.rs:262-282)

### Lines 283-311

slice_with_length asserts offset.saturating_add(length)<=self.len then delegates to Arrow slice; valid ranges share allocation, invalid ranges panic. Bit slicing delegates to Arrow bit_slice; documentation promises little-endian bit interpretation and copying unless byte-aligned. This file does not implement the dependency masking/bounds behavior; local tests cover specific results. (rust/lance-encoding/src/buffer.rs:283-311)

### Lines 312-345

as_ptr delegates to Arrow; its pointer remains dependent on an owner lifetime. AsRef<[u8]> exposes visible bytes; Deref Target=[u8] forwards to AsRef. From<Vec<u8>> and From<Buffer> move input storage into wrapper. No borrowed custom IntoIterator or explicit mutation method is introduced. (rust/lance-encoding/src/buffer.rs:312-345)

### Lines 346-379

Public LanceBufferIter has private Buffer and usize index. Iterator Item=u8: next first checks index>=len and returns None, otherwise unsafe get_unchecked is justified by that check, then increments index and returns a copied byte. IntoIterator consumes LanceBuffer, moves its Buffer into the iterator and starts at0. Comment says clone/borrowed but actual implementation moves an owning Buffer. Terminal calls remain None, but no FusedIterator, ExactSizeIterator or custom size_hint is declared. (rust/lance-encoding/src/buffer.rs:346-379)

### Lines 380-407

cfg(test): test_eq compares Vec and Arrow-created buffers by contents. test_reinterpret_vec checks u32[1,2,3] LE byte pattern and typed values; no pointer-identity assertion. Crate itself rejects non-little-endian targets. (rust/lance-encoding/src/lib.rs:27-31) (rust/lance-encoding/src/buffer.rs:380-407)

### Lines 408-453

test_concat covers three inputs, singleton empty and nonempty plus empty, using concat_into_one; it does not cover concat or zero inputs. test_zip interleaves widths8,16,32 for three values and checks all21 bytes. No invalid width, short input, overflow or zero-width zipper tests. (rust/lance-encoding/src/buffer.rs:408-453)

### Lines 454-490

test_hex asserts uppercase. should_panic test rejects a three-byte buffer interpreted as u16. test_borrow_to_typed_slice compares two aligned typed handles sharing a pointer, then two simultaneously live copies from a deliberately offset Bytes slice producing different pointers. The test assumes initial allocation alignment; no test of borrow_to_typed_view is present. Tests were read, not run. (rust/lance-encoding/src/buffer.rs:454-490)

### Lines 491-503

Bit-slice test uses input[0x0f,0x0b] and asserts (offset,length): (0,4)->[0x0f], (4,4)->[0], (3,8)->[0x61], (0,8)->[0x0f], (4,8)->[0xb0], (4,12)->[0xb0,0]. Eight local tests total; no async lifecycle, local mutex or feature-gated production branch. (rust/lance-encoding/src/buffer.rs:491-503)

## Interaction and interpretation limits

Every physical line was read during ANALYZE73 in bounded outputs. Offline read-only source inspection only: no repository build, test, lint, benchmark, generator or dependency installation. Exact declarations and source are retained below. Contextual caller snippets do not claim whole-file coverage; lexical references do not establish a resolved call graph.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Utilities for byte arrays
    5 | 
    6 | use std::{ops::Deref, panic::RefUnwindSafe, ptr::NonNull, sync::Arc};
    7 | 
    8 | use arrow_buffer::{ArrowNativeType, Buffer, MutableBuffer, ScalarBuffer};
    9 | use lance_core::{Error, Result, utils::bit::is_pwr_two};
   10 | use std::borrow::Cow;
   11 | 
   12 | /// A copy-on-write byte buffer.
   13 | ///
   14 | /// It wraps arrow_buffer::Buffer which provides:
   15 | /// - Cheap cloning (reference counted)
   16 | /// - Zero-copy slicing
   17 | /// - Automatic memory alignment
   18 | ///
   19 | /// LanceBuffer is designed to be used in situations where you might need to
   20 | /// pass around byte buffers efficiently without worrying about ownership.
   21 | #[derive(Clone, Debug, PartialEq, Eq)]
   22 | pub struct LanceBuffer(Buffer);
   23 | 
   24 | impl LanceBuffer {
   25 |     /// Convert into an Arrow buffer. Never copies data.
   26 |     pub fn into_buffer(self) -> Buffer {
   27 |         self.0
   28 |     }
   29 | 
   30 |     /// Returns a buffer of the given size with all bits set to 0
   31 |     pub fn all_unset(len: usize) -> Self {
   32 |         Self(Buffer::from_vec(vec![0; len]))
   33 |     }
   34 | 
   35 |     /// Returns a buffer of the given size with all bits set to 1
   36 |     pub fn all_set(len: usize) -> Self {
   37 |         Self(Buffer::from_vec(vec![0xff; len]))
   38 |     }
   39 | 
   40 |     /// Creates an empty buffer
   41 |     pub fn empty() -> Self {
   42 |         Self(Buffer::from_vec(Vec::<u8>::new()))
   43 |     }
   44 | 
   45 |     /// Converts the buffer into a hex string
   46 |     pub fn as_hex(&self) -> String {
   47 |         hex::encode_upper(self)
   48 |     }
   49 | 
   50 |     /// Combine multiple buffers into a single buffer
   51 |     ///
   52 |     /// This does involve a data copy (and allocation of a new buffer)
   53 |     pub fn concat(buffers: &[Self]) -> Self {
   54 |         let total_len = buffers.iter().map(|b| b.len()).sum();
   55 |         let mut data = Vec::with_capacity(total_len);
   56 |         for buffer in buffers {
   57 |             data.extend_from_slice(buffer.as_ref());
   58 |         }
   59 |         Self(Buffer::from_vec(data))
   60 |     }
   61 | 
   62 |     /// Converts the buffer into a hex string, inserting a space
   63 |     /// between words
   64 |     pub fn as_spaced_hex(&self, bytes_per_word: u32) -> String {
   65 |         let hex = self.as_hex();
   66 |         let chars_per_word = bytes_per_word as usize * 2;
   67 |         let num_words = hex.len() / chars_per_word;
   68 |         let mut spaced_hex = String::with_capacity(hex.len() + num_words);
   69 |         for (i, c) in hex.chars().enumerate() {
   70 |             if i % chars_per_word == 0 && i != 0 {
   71 |                 spaced_hex.push(' ');
   72 |             }
   73 |             spaced_hex.push(c);
   74 |         }
   75 |         spaced_hex
   76 |     }
   77 | 
   78 |     /// Create a LanceBuffer from a bytes::Bytes object
   79 |     ///
   80 |     /// The alignment must be specified (as `bytes_per_value`) since we want to make
   81 |     /// sure we can safely reinterpret the buffer.
   82 |     ///
   83 |     /// If the buffer is properly aligned this will be zero-copy.  If not, a copy
   84 |     /// will be made.
   85 |     ///
   86 |     /// If `bytes_per_value` is not a power of two, then we assume the buffer is
   87 |     /// never going to be reinterpret into another type and we can safely
   88 |     /// ignore the alignment.
   89 |     ///
   90 |     /// This is a zero-copy operation when the buffer is properly aligned.
   91 |     pub fn from_bytes(bytes: bytes::Bytes, bytes_per_value: u64) -> Self {
   92 |         if is_pwr_two(bytes_per_value) && bytes.as_ptr().align_offset(bytes_per_value as usize) != 0
   93 |         {
   94 |             // The original buffer is not aligned, cannot zero-copy
   95 |             let mut buf = Vec::with_capacity(bytes.len());
   96 |             buf.extend_from_slice(&bytes);
   97 |             Self(Buffer::from_vec(buf))
   98 |         } else {
   99 |             // The original buffer is aligned, can zero-copy
  100 |             // SAFETY: the alignment is correct we can make this conversion
  101 |             unsafe {
  102 |                 Self(Buffer::from_custom_allocation(
  103 |                     NonNull::new(bytes.as_ptr() as _).expect("should be a valid pointer"),
  104 |                     bytes.len(),
  105 |                     Arc::new(bytes),
  106 |                 ))
  107 |             }
  108 |         }
  109 |     }
  110 | 
  111 |     /// Make an owned copy of the buffer (always does a copy of the data)
  112 |     pub fn deep_copy(&self) -> Self {
  113 |         Self(Buffer::from_vec(self.0.to_vec()))
  114 |     }
  115 | 
  116 |     /// Reinterprets a `Vec<T>` as a LanceBuffer
  117 |     ///
  118 |     /// This is a zero-copy operation. We can safely reinterpret `Vec<T>` into `&[u8]` which is what happens here.
  119 |     /// However, we cannot safely reinterpret a `Vec<T>` into a `Vec<u8>` in rust due to alignment constraints
  120 |     /// from [`Vec::from_raw_parts`]:
  121 |     ///
  122 |     /// > `T` needs to have the same alignment as what `ptr` was allocated with.
  123 |     /// > (`T` having a less strict alignment is not sufficient, the alignment really
  124 |     /// > needs to be equal to satisfy the `dealloc` requirement that memory must be
  125 |     /// > allocated and deallocated with the same layout.)
  126 |     pub fn reinterpret_vec<T: ArrowNativeType>(vec: Vec<T>) -> Self {
  127 |         Self(Buffer::from_vec(vec))
  128 |     }
  129 | 
  130 |     /// Reinterprets `Arc<[T]>` as a LanceBuffer
  131 |     ///
  132 |     /// This is similar to [`Self::reinterpret_vec`] but for `Arc<[T]>` instead of `Vec<T>`
  133 |     ///
  134 |     /// The same alignment constraints apply
  135 |     pub fn reinterpret_slice<T: ArrowNativeType + RefUnwindSafe>(arc: Arc<[T]>) -> Self {
  136 |         let slice = arc.as_ref();
  137 |         let data = NonNull::new(slice.as_ptr() as _).unwrap_or(NonNull::dangling());
  138 |         let len = std::mem::size_of_val(slice);
  139 |         // SAFETY: the ptr will be valid for len items if the Arc<[T]> is valid
  140 |         let buffer = unsafe { Buffer::from_custom_allocation(data, len, Arc::new(arc)) };
  141 |         Self(buffer)
  142 |     }
  143 | 
  144 |     /// Reinterprets a LanceBuffer into a `Vec<T>`
  145 |     ///
  146 |     /// If the underlying buffer is not properly aligned, this will involve a copy of the data
  147 |     ///
  148 |     /// Note: doing this sort of re-interpretation generally makes assumptions about the endianness
  149 |     /// of the data.  Lance does not support big-endian machines so this is safe.  However, if we end
  150 |     /// up supporting big-endian machines in the future, then any use of this method will need to be
  151 |     /// carefully reviewed.
  152 |     pub fn borrow_to_typed_slice<T: ArrowNativeType>(&self) -> ScalarBuffer<T> {
  153 |         let align = std::mem::align_of::<T>();
  154 |         let is_aligned = self.as_ptr().align_offset(align) == 0;
  155 |         if !self.len().is_multiple_of(std::mem::size_of::<T>()) {
  156 |             panic!(
  157 |                 "attempt to borrow_to_typed_slice to data type of size {} but we have {} bytes which isn't evenly divisible",
  158 |                 std::mem::size_of::<T>(),
  159 |                 self.len()
  160 |             );
  161 |         }
  162 | 
  163 |         if is_aligned {
  164 |             ScalarBuffer::<T>::from(self.clone().into_buffer())
  165 |         } else {
  166 |             let num_values = self.len() / std::mem::size_of::<T>();
  167 |             let vec = Vec::<T>::with_capacity(num_values);
  168 |             let mut bytes = MutableBuffer::from(vec);
  169 |             bytes.extend_from_slice(self);
  170 |             ScalarBuffer::<T>::from(Buffer::from(bytes))
  171 |         }
  172 |     }
  173 | 
  174 |     /// Reinterprets a LanceBuffer into a `&[T]`
  175 |     ///
  176 |     /// Unlike [`Self::borrow_to_typed_slice`], this function returns a `Cow<'_, [T]>` instead of an owned
  177 |     /// buffer. It saves the cost of Arc creation and destruction, which can be really helpful when
  178 |     /// we borrow data and just drop it without reusing it.
  179 |     ///
  180 |     /// Caller should decide which way to use based on their own needs.
  181 |     ///
  182 |     /// If the underlying buffer is not properly aligned, this will involve a copy of the data
  183 |     ///
  184 |     /// Note: doing this sort of re-interpretation generally makes assumptions about the endianness
  185 |     /// of the data.  Lance does not support big-endian machines so this is safe.  However, if we end
  186 |     /// up supporting big-endian machines in the future, then any use of this method will need to be
  187 |     /// carefully reviewed.
  188 |     pub fn borrow_to_typed_view<T: ArrowNativeType + bytemuck::Pod>(&self) -> Cow<'_, [T]> {
  189 |         let align = std::mem::align_of::<T>();
  190 |         if !self.len().is_multiple_of(std::mem::size_of::<T>()) {
  191 |             panic!(
  192 |                 "attempt to view data type of size {} but we have {} bytes which isn't evenly divisible",
  193 |                 std::mem::size_of::<T>(),
  194 |                 self.len()
  195 |             );
  196 |         }
  197 | 
  198 |         if self.as_ptr().align_offset(align) == 0 {
  199 |             Cow::Borrowed(bytemuck::cast_slice(&self.0))
  200 |         } else {
  201 |             Cow::Owned(bytemuck::pod_collect_to_vec(self.0.as_slice()))
  202 |         }
  203 |     }
  204 | 
  205 |     /// Concatenates multiple buffers into a single buffer, consuming the input buffers
  206 |     ///
  207 |     /// If there is only one buffer, it will be returned as is
  208 |     pub fn concat_into_one(buffers: Vec<Self>) -> Self {
  209 |         if buffers.len() == 1 {
  210 |             return buffers.into_iter().next().unwrap();
  211 |         }
  212 | 
  213 |         let mut total_len = 0;
  214 |         for buffer in &buffers {
  215 |             total_len += buffer.len();
  216 |         }
  217 | 
  218 |         let mut data = Vec::with_capacity(total_len);
  219 |         for buffer in buffers {
  220 |             data.extend_from_slice(buffer.as_ref());
  221 |         }
  222 | 
  223 |         Self(Buffer::from_vec(data))
  224 |     }
  225 | 
  226 |     /// Zips multiple buffers into a single buffer, consuming the input buffers
  227 |     ///
  228 |     /// Unlike concat_into_one this "zips" the buffers, interleaving the values
  229 |     pub fn zip_into_one(buffers: Vec<(Self, u64)>, num_values: u64) -> Result<Self> {
  230 |         let bytes_per_value = buffers.iter().map(|(_, bits_per_value)| {
  231 |             if bits_per_value % 8 == 0 {
  232 |                 Ok(bits_per_value / 8)
  233 |             } else {
  234 |                 Err(Error::invalid_input_source(format!("LanceBuffer::zip_into_one only supports full-byte buffers currently and received a buffer with {} bits per value", bits_per_value).into()))
  235 |             }
  236 |         }).collect::<Result<Vec<_>>>()?;
  237 |         let total_bytes_per_value = bytes_per_value.iter().sum::<u64>();
  238 |         let total_bytes = (total_bytes_per_value * num_values) as usize;
  239 | 
  240 |         let mut zipped = vec![0_u8; total_bytes];
  241 |         let mut buffer_ptrs = buffers
  242 |             .iter()
  243 |             .zip(bytes_per_value)
  244 |             .map(|((buffer, _), bytes_per_value)| (buffer.as_ptr(), bytes_per_value as usize))
  245 |             .collect::<Vec<_>>();
  246 | 
  247 |         let mut zipped_ptr = zipped.as_mut_ptr();
  248 |         unsafe {
  249 |             let end = zipped_ptr.add(total_bytes);
  250 |             while zipped_ptr < end {
  251 |                 for (buf, bytes_per_value) in buffer_ptrs.iter_mut() {
  252 |                     std::ptr::copy_nonoverlapping(*buf, zipped_ptr, *bytes_per_value);
  253 |                     zipped_ptr = zipped_ptr.add(*bytes_per_value);
  254 |                     *buf = buf.add(*bytes_per_value);
  255 |                 }
  256 |             }
  257 |         }
  258 | 
  259 |         Ok(Self(Buffer::from_vec(zipped)))
  260 |     }
  261 | 
  262 |     /// Create a LanceBuffer from a slice
  263 |     ///
  264 |     /// This is NOT a zero-copy operation.  We can't create a borrowed buffer because
  265 |     /// we have no way of extending the lifetime of the slice.
  266 |     pub fn copy_slice(slice: &[u8]) -> Self {
  267 |         Self(Buffer::from_vec(slice.to_vec()))
  268 |     }
  269 | 
  270 |     /// Create a LanceBuffer from an array (fixed-size slice)
  271 |     ///
  272 |     /// This is NOT a zero-copy operation.  The slice memory could be on the stack and
  273 |     /// thus we can't forget it.
  274 |     pub fn copy_array<const N: usize>(array: [u8; N]) -> Self {
  275 |         Self(Buffer::from_vec(Vec::from(array)))
  276 |     }
  277 | 
  278 |     #[allow(clippy::len_without_is_empty)]
  279 |     pub fn len(&self) -> usize {
  280 |         self.0.len()
  281 |     }
  282 | 
  283 |     /// Returns a new [LanceBuffer] that is a slice of this buffer starting at `offset`,
  284 |     /// with `length` bytes.
  285 |     /// Doing so allows the same memory region to be shared between lance buffers.
  286 |     /// # Panics
  287 |     /// Panics if `(offset + length)` is larger than the existing length.
  288 |     pub fn slice_with_length(&self, offset: usize, length: usize) -> Self {
  289 |         let original_buffer_len = self.len();
  290 |         assert!(
  291 |             offset.saturating_add(length) <= original_buffer_len,
  292 |             "the offset + length of the sliced Buffer cannot exceed the existing length"
  293 |         );
  294 |         Self(self.0.slice_with_length(offset, length))
  295 |     }
  296 | 
  297 |     /// Returns a new [LanceBuffer] that is a slice of this buffer starting at bit `offset`
  298 |     /// with `length` bits.
  299 |     ///
  300 |     /// Unlike `slice_with_length`, this method allows for slicing at a bit level but always
  301 |     /// requires a copy of the data (unless offset is byte-aligned)
  302 |     ///
  303 |     /// This method performs the bit slice using the Arrow convention of *bitwise* little-endian
  304 |     ///
  305 |     /// This means, given the bit buffer 0bABCDEFGH_HIJKLMNOP and the slice starting at bit 3 and
  306 |     /// with length 8, the result will be 0bNOPABCDE
  307 |     pub fn bit_slice_le_with_length(&self, offset: usize, length: usize) -> Self {
  308 |         let sliced = self.0.bit_slice(offset, length);
  309 |         Self(sliced)
  310 |     }
  311 | 
  312 |     /// Get a pointer to the underlying data
  313 |     pub fn as_ptr(&self) -> *const u8 {
  314 |         self.0.as_ptr()
  315 |     }
  316 | }
  317 | 
  318 | impl AsRef<[u8]> for LanceBuffer {
  319 |     fn as_ref(&self) -> &[u8] {
  320 |         self.0.as_slice()
  321 |     }
  322 | }
  323 | 
  324 | impl Deref for LanceBuffer {
  325 |     type Target = [u8];
  326 | 
  327 |     fn deref(&self) -> &Self::Target {
  328 |         self.as_ref()
  329 |     }
  330 | }
  331 | 
  332 | // All `From` implementations are zero-copy
  333 | 
  334 | impl From<Vec<u8>> for LanceBuffer {
  335 |     fn from(buffer: Vec<u8>) -> Self {
  336 |         Self(Buffer::from_vec(buffer))
  337 |     }
  338 | }
  339 | 
  340 | impl From<Buffer> for LanceBuffer {
  341 |     fn from(buffer: Buffer) -> Self {
  342 |         Self(buffer)
  343 |     }
  344 | }
  345 | 
  346 | // An iterator that keeps a clone of a borrowed LanceBuffer so we
  347 | // can have a 'static lifetime
  348 | pub struct LanceBufferIter {
  349 |     buffer: Buffer,
  350 |     index: usize,
  351 | }
  352 | 
  353 | impl Iterator for LanceBufferIter {
  354 |     type Item = u8;
  355 | 
  356 |     fn next(&mut self) -> Option<Self::Item> {
  357 |         if self.index >= self.buffer.len() {
  358 |             None
  359 |         } else {
  360 |             // SAFETY: we just checked that index is in bounds
  361 |             let byte = unsafe { self.buffer.get_unchecked(self.index) };
  362 |             self.index += 1;
  363 |             Some(*byte)
  364 |         }
  365 |     }
  366 | }
  367 | 
  368 | impl IntoIterator for LanceBuffer {
  369 |     type Item = u8;
  370 |     type IntoIter = LanceBufferIter;
  371 | 
  372 |     fn into_iter(self) -> Self::IntoIter {
  373 |         LanceBufferIter {
  374 |             buffer: self.0,
  375 |             index: 0,
  376 |         }
  377 |     }
  378 | }
  379 | 
  380 | #[cfg(test)]
  381 | mod tests {
  382 |     use arrow_buffer::Buffer;
  383 | 
  384 |     use super::LanceBuffer;
  385 | 
  386 |     #[test]
  387 |     fn test_eq() {
  388 |         let buf = LanceBuffer::from(Buffer::from_vec(vec![1_u8, 2, 3]));
  389 |         let buf2 = LanceBuffer::from(vec![1, 2, 3]);
  390 |         assert_eq!(buf, buf2);
  391 |     }
  392 | 
  393 |     #[test]
  394 |     fn test_reinterpret_vec() {
  395 |         let vec = vec![1_u32, 2, 3];
  396 |         let buf = LanceBuffer::reinterpret_vec(vec);
  397 | 
  398 |         let mut expected = Vec::with_capacity(12);
  399 |         expected.extend_from_slice(&1_u32.to_ne_bytes());
  400 |         expected.extend_from_slice(&2_u32.to_ne_bytes());
  401 |         expected.extend_from_slice(&3_u32.to_ne_bytes());
  402 |         let expected = LanceBuffer::from(expected);
  403 | 
  404 |         assert_eq!(expected, buf);
  405 |         assert_eq!(buf.borrow_to_typed_slice::<u32>().as_ref(), vec![1, 2, 3]);
  406 |     }
  407 | 
  408 |     #[test]
  409 |     fn test_concat() {
  410 |         let buf1 = LanceBuffer::from(vec![1_u8, 2, 3]);
  411 |         let buf2 = LanceBuffer::from(vec![4_u8, 5, 6]);
  412 |         let buf3 = LanceBuffer::from(vec![7_u8, 8, 9]);
  413 | 
  414 |         let expected = LanceBuffer::from(vec![1, 2, 3, 4, 5, 6, 7, 8, 9]);
  415 |         assert_eq!(
  416 |             expected,
  417 |             LanceBuffer::concat_into_one(vec![buf1, buf2, buf3])
  418 |         );
  419 | 
  420 |         let empty = LanceBuffer::empty();
  421 |         assert_eq!(
  422 |             LanceBuffer::empty(),
  423 |             LanceBuffer::concat_into_one(vec![empty])
  424 |         );
  425 | 
  426 |         let expected = LanceBuffer::from(vec![1, 2, 3]);
  427 |         assert_eq!(
  428 |             expected,
  429 |             LanceBuffer::concat_into_one(vec![expected.deep_copy(), LanceBuffer::empty()])
  430 |         );
  431 |     }
  432 | 
  433 |     #[test]
  434 |     fn test_zip() {
  435 |         let buf1 = LanceBuffer::from(vec![1_u8, 2, 3]);
  436 |         let buf2 = LanceBuffer::reinterpret_vec(vec![1_u16, 2, 3]);
  437 |         let buf3 = LanceBuffer::reinterpret_vec(vec![1_u32, 2, 3]);
  438 | 
  439 |         let zipped = LanceBuffer::zip_into_one(vec![(buf1, 8), (buf2, 16), (buf3, 32)], 3).unwrap();
  440 | 
  441 |         assert_eq!(zipped.len(), 21);
  442 | 
  443 |         let mut expected = Vec::with_capacity(21);
  444 |         for i in 1..4 {
  445 |             expected.push(i as u8);
  446 |             expected.extend_from_slice(&(i as u16).to_ne_bytes());
  447 |             expected.extend_from_slice(&(i as u32).to_ne_bytes());
  448 |         }
  449 |         let expected = LanceBuffer::from(expected);
  450 | 
  451 |         assert_eq!(expected, zipped);
  452 |     }
  453 | 
  454 |     #[test]
  455 |     fn test_hex() {
  456 |         let buf = LanceBuffer::from(vec![1, 2, 15, 20]);
  457 |         assert_eq!("01020F14", buf.as_hex());
  458 |     }
  459 | 
  460 |     #[test]
  461 |     #[should_panic]
  462 |     fn test_to_typed_slice_invalid() {
  463 |         let buf = LanceBuffer::from(vec![0, 1, 2]);
  464 |         buf.borrow_to_typed_slice::<u16>();
  465 |     }
  466 | 
  467 |     #[test]
  468 |     fn test_to_typed_slice() {
  469 |         // Buffer is aligned, no copy will be made, both calls
  470 |         // should get same ptr
  471 |         let buf = LanceBuffer::from(vec![0, 1]);
  472 |         let borrow = buf.borrow_to_typed_slice::<u16>();
  473 |         let view_ptr = borrow.as_ref().as_ptr();
  474 |         let borrow2 = buf.borrow_to_typed_slice::<u16>();
  475 |         let view_ptr2 = borrow2.as_ref().as_ptr();
  476 | 
  477 |         assert_eq!(view_ptr, view_ptr2);
  478 | 
  479 |         let bytes = bytes::Bytes::from(vec![0, 1, 2]);
  480 |         let sliced = bytes.slice(1..3);
  481 |         // Intentionally LYING about alignment here to trigger test
  482 |         let buf = LanceBuffer::from_bytes(sliced, 1);
  483 |         let borrow = buf.borrow_to_typed_slice::<u16>();
  484 |         let view_ptr = borrow.as_ref().as_ptr();
  485 |         let borrow2 = buf.borrow_to_typed_slice::<u16>();
  486 |         let view_ptr2 = borrow2.as_ref().as_ptr();
  487 | 
  488 |         assert_ne!(view_ptr, view_ptr2);
  489 |     }
  490 | 
  491 |     #[test]
  492 |     fn test_bit_slice_le() {
  493 |         let buf = LanceBuffer::from(vec![0x0F, 0x0B]);
  494 | 
  495 |         // Keep in mind that validity buffers are *bitwise* little-endian
  496 |         assert_eq!(buf.bit_slice_le_with_length(0, 4).as_ref(), &[0x0F]);
  497 |         assert_eq!(buf.bit_slice_le_with_length(4, 4).as_ref(), &[0x00]);
  498 |         assert_eq!(buf.bit_slice_le_with_length(3, 8).as_ref(), &[0x61]);
  499 |         assert_eq!(buf.bit_slice_le_with_length(0, 8).as_ref(), &[0x0F]);
  500 |         assert_eq!(buf.bit_slice_le_with_length(4, 8).as_ref(), &[0xB0]);
  501 |         assert_eq!(buf.bit_slice_le_with_length(4, 12).as_ref(), &[0xB0, 0x00]);
  502 |     }
  503 | }
``````

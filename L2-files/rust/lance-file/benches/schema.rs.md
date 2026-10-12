> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/benches/schema.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f006cc9f537db6cc6d58d83ed3cc2baedf5881851f491181929e657c8a76f780`. Reviewed physical lines: 1-73.

[Module](../../../../L1-modules/archive/rust-lance-file-benchmarks.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion schema-reconstruction executable: synthetic wide struct protobuf Field lists converted to Lance Schema. Separates input construction from timed conversion and reports flat field count as throughput despite leaf-count benchmark labels. (rust/lance-file/benches/schema.rs:1-73)

## Complete range analysis

### Lines 1-9

SPDX/imports bring black_box, Criterion identifiers/throughput/macros, core Schema and file Fields/generated protobuf. This benchmark works on already-created protobuf messages in memory; it performs no protobuf byte parsing, file IO, dataset opening or Arrow record-batch scan. (rust/lance-file/benches/schema.rs:1-9)

### Lines 10-19

Private proto_field stores signed id,parent_id,owned name and newly owned logical_type; all other protobuf fields remain Default. No nullability/encoding/metadata override or validation. It is a fixture constructor, not production schema-ID allocation. (rust/lance-file/benches/schema.rs:10-19)

### Lines 20-28

wide_two_leaf_structs asserts even num_physical_columns, divides by2 for root count, and reserves root+leaf field capacity. Parameter names physical columns mean leaves, not total protobuf entries; each root adds another entry. Zero is accepted and returns an empty Fields wrapper. There is no checked capacity arithmetic or general usize-to-i32 range bound. (rust/lance-file/benches/schema.rs:20-28)

### Lines 29-52

For root indexi assign parent ID(3*i) cast to i32, root parent_id-1/name struct_i/logical struct, then leaves IDsparent+1/parent+2 namesleft_i/right_i logical int32 and parent_id equal root. Emit exact pre-order parent,left,right; consumes3 IDs per struct. Arithmetic/casts are unchecked for arbitrary huge inputs. Active leaf counts below keep IDs in range. Returns Fields(Vec<pb::Field>) without separately validating fixture shape. (rust/lance-file/benches/schema.rs:29-52)

### Lines 53-60

bench_schema_reconstruction creates group schema_from_flat_fields; four leaf counts1024,4096,16384,65536 create512,2048,8192,32768 roots and total1536,6144,24576,98304 flat entries. Fixture building occurs once per case outside timed closure. Throughput::Elements uses fields.0.len, hence ALL root+leaf entries, while parameter is physical leaf count. (rust/lance-file/benches/schema.rs:53-60)

### Lines 61-71

bench_with_input names each case physical_columns/<leaf count> and borrows prebuilt Fields. Timed bencher.iter calls Schema::try_from(black_box(fields)).unwrap(), returning the new schema to Criterion. Measures reconstruction/allocation from parsed messages, not decoding protobuf bytes or fixture generation. No equality, shape, performance-threshold or memory assertion follows; Criterion owns result handling. Explicit group.finish closes registration. (rust/lance-file/benches/schema.rs:61-71)

### Lines 72-73

criterion_group!(benches,bench_schema_reconstruction) uses unmodified Criterion default configuration; criterion_main!(benches) generates executable entry. No platform profiler branch, custom sample size/significance/warmup/measurement duration, environment variable or local test module. Cargo schema entry uses harness=false (rust/lance-file/Cargo.toml:67-69). (rust/lance-file/benches/schema.rs:72-73)

## Interaction and interpretation limits

All73 physical lines read in one complete bounded output during ANALYZE65. No benchmark/source execution or measurement. Input construction and conversion call are documented; Criterion dependency timing/destruction internals are not fetched. The actual schema conversion was analyzed separately. No source edits, installs, network or fixture generators.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::hint::black_box;
    5 | 
    6 | use criterion::{BenchmarkId, Criterion, Throughput, criterion_group, criterion_main};
    7 | use lance_core::datatypes::Schema;
    8 | use lance_file::{datatypes::Fields, format::pb};
    9 | 
   10 | fn proto_field(id: i32, parent_id: i32, name: String, logical_type: &str) -> pb::Field {
   11 |     pb::Field {
   12 |         id,
   13 |         parent_id,
   14 |         name,
   15 |         logical_type: logical_type.to_owned(),
   16 |         ..Default::default()
   17 |     }
   18 | }
   19 | 
   20 | /// Builds a pre-order flat schema with `num_physical_columns` physical leaves.
   21 | ///
   22 | /// Each struct contributes one parent and two `int32` leaves. Root fields use
   23 | /// `-1` as `parent_id`, and each struct consumes a three-ID block.
   24 | fn wide_two_leaf_structs(num_physical_columns: usize) -> Fields {
   25 |     assert_eq!(num_physical_columns % 2, 0);
   26 |     let num_structs = num_physical_columns / 2;
   27 |     let mut fields = Vec::with_capacity(num_structs + num_physical_columns);
   28 | 
   29 |     for struct_index in 0..num_structs {
   30 |         let parent_id = (struct_index * 3) as i32;
   31 |         fields.push(proto_field(
   32 |             parent_id,
   33 |             -1,
   34 |             format!("struct_{struct_index}"),
   35 |             "struct",
   36 |         ));
   37 |         fields.push(proto_field(
   38 |             parent_id + 1,
   39 |             parent_id,
   40 |             format!("left_{struct_index}"),
   41 |             "int32",
   42 |         ));
   43 |         fields.push(proto_field(
   44 |             parent_id + 2,
   45 |             parent_id,
   46 |             format!("right_{struct_index}"),
   47 |             "int32",
   48 |         ));
   49 |     }
   50 | 
   51 |     Fields(fields)
   52 | }
   53 | 
   54 | fn bench_schema_reconstruction(c: &mut Criterion) {
   55 |     let mut group = c.benchmark_group("schema_from_flat_fields");
   56 | 
   57 |     for num_physical_columns in [1024, 4096, 16_384, 65_536] {
   58 |         let fields = wide_two_leaf_structs(num_physical_columns);
   59 |         group.throughput(Throughput::Elements(fields.0.len() as u64));
   60 |         group.bench_with_input(
   61 |             BenchmarkId::new("physical_columns", num_physical_columns),
   62 |             &fields,
   63 |             |bencher, fields| {
   64 |                 bencher.iter(|| Schema::try_from(black_box(fields)).unwrap());
   65 |             },
   66 |         );
   67 |     }
   68 | 
   69 |     group.finish();
   70 | }
   71 | 
   72 | criterion_group!(benches, bench_schema_reconstruction);
   73 | criterion_main!(benches);
``````

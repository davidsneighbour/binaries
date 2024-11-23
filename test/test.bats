#!/usr/bin/env bats

bats_require_minimum_version 1.11.0

setup() {
    load 'test_helper/common-setup'
    _common_setup
}

@test "can run our script" {
    run _get_lib.sh
    assert_output ""
}

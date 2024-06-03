﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using spotters.Data;

#nullable disable

namespace spotters.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240530091224_AddUserReferences")]
    partial class AddUserReferences
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("spotters.Modal.PlaneSighting", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("AirlineCode")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CreatedUserId")
                        .HasColumnType("int");

                    b.Property<bool>("Delete")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("varchar(200)");

                    b.Property<int?>("ModifiedUserId")
                        .IsRequired()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("varchar(150)");

                    b.Property<byte[]>("Photo")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("ShortName")
                        .IsRequired()
                        .HasMaxLength(5)
                        .HasColumnType("varchar(5)");

                    b.HasKey("Id");

                    b.HasIndex("CreatedUserId");

                    b.HasIndex("ModifiedUserId");

                    b.ToTable("AirlineSightings");
                });

            modelBuilder.Entity("spotters.Modal.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("spotters.Modal.PlaneSighting", b =>
                {
                    b.HasOne("spotters.Modal.User", "CreatedUser")
                        .WithMany()
                        .HasForeignKey("CreatedUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("spotters.Modal.User", "ModifiedUser")
                        .WithMany()
                        .HasForeignKey("ModifiedUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("CreatedUser");

                    b.Navigation("ModifiedUser");
                });
#pragma warning restore 612, 618
        }
    }
}

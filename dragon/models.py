"""models for app: dragon"""

from django.db import models
from django.contrib.auth.models import User


class Pattern(models.Model):
    """user created pattern items"""
    creator = models.ForeignKey(
        User,
        related_name="patterns",
        on_delete=models.CASCADE,
        default=1,
    )
    name = models.CharField(max_length=24)
    data = models.CharField(max_length=255)
    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ("creator", "name")

    def __str__(self):
        return f'{self.name} by {self.creator.username}'


class Vote(models.Model):
    """table to track votes for patterns"""
    voter = models.ForeignKey(
        User,
        related_name="votes",
        on_delete=models.CASCADE,
        default=1,
    )
    voted_for = models.ForeignKey(
        Pattern,
        related_name="pattern",
        on_delete=models.CASCADE,
        default=1,
    )

    def __str__(self):
        return f'{self.voter.username} upvoted {self.voted_for}'
